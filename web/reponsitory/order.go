package reponsitory

import (
	"DoAnToiNghiep/model"
	"bytes"
	"context"
	"encoding/base64"
	"errors"
	"image/png"
	"log"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/code128"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderRepo interface {
	CreateOrderFromCart(ctx context.Context, userID string) (*model.Order, error)
}

type OrderRepoI struct {
	DB *mongo.Database
}

func NewOrderRepo(db *mongo.Database) OrderRepo {
	return &OrderRepoI{DB: db}
}

// Create a order
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
	// Tạo barcode cho đơn hàng
	barcodeData := userID + primitive.NewObjectID().Hex()

	barcodeImage, err := code128.Encode(barcodeData)
	if err != nil {
		log.Printf("Error creating barcode: %v", err)
		return nil, err
	}
	scaledBarcode, err := barcode.Scale(barcodeImage, 300, 150)
	if err != nil {
		log.Printf("Error scaling barcode: %v", err)
		return nil, errors.New("failed to scale barcode")
	}

	// Convert barcode image to base64 string
	var buffer bytes.Buffer
	if err := png.Encode(&buffer, scaledBarcode); err != nil {
		log.Printf("Error saving barcode image: %v", err)
		return nil, errors.New("failed to save barcode image")
	}
	base64String := base64.StdEncoding.EncodeToString(buffer.Bytes())

	// Tạo đơn hàng mới
	order := model.Order{
		ID:           primitive.NewObjectID(),
		UserID:       userID,
		LineItems:    cart.LineItems,
		BarcodeOrder: base64String,
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
