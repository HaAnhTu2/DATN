package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"errors"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderRepo interface {
	CreateOrder(ctx context.Context, order model.Order) (model.Order, error)
	CreateOrderFromCart(ctx context.Context, userID string) (*model.Order, error)
}

type OrderRepoI struct {
	DB *mongo.Database
}

func NewOrderRepo(db *mongo.Database) OrderRepo {
	return &OrderRepoI{DB: db}
}

// Create a new order
func (o *OrderRepoI) CreateOrder(ctx context.Context, order model.Order) (model.Order, error) {
	result, err := o.DB.Collection("orders").InsertOne(ctx, order)
	if err != nil {
		return model.Order{}, err
	}
	order.ID = result.InsertedID.(primitive.ObjectID)
	return order, nil
}

func (o *OrderRepoI) CreateOrderFromCart(ctx context.Context, userID string) (*model.Order, error) {
	// Validate user ID
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		log.Printf("Invalid user ID: %v", err)
		return nil, errors.New("invalid user ID")
	}

	// Lấy dữ liệu từ giỏ hàng
	var cart model.Cart
	err = o.DB.Collection("carts").FindOne(ctx, bson.M{"_id": userObjectID}).Decode(&cart)
	if err != nil {
		log.Printf("Error retrieving cart: %v", err)
		return nil, errors.New("cart not found")
	}

	if len(cart.LineItems) == 0 {
		log.Println("Cart is empty")
		return nil, errors.New("cart is empty")
	}

	// Tạo đơn hàng mới
	order := model.Order{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		LineItems: cart.LineItems,
	}
	_, err = o.DB.Collection("orders").InsertOne(ctx, order)
	if err != nil {
		log.Printf("Error creating order: %v", err)
		return nil, errors.New("failed to create order")
	}

	// Xóa LineItems khỏi giỏ hàng
	_, err = o.DB.Collection("carts").UpdateOne(
		ctx,
		bson.M{"_id": userObjectID},
		bson.M{"$set": bson.M{"line_items": []model.LineItem{}}},
	)
	if err != nil {
		log.Printf("Error clearing cart: %v", err)
		return nil, errors.New("failed to clear cart")
	}

	log.Printf("Order created successfully for user %s", userID)
	return &order, nil
}
