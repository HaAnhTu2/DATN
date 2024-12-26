package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"errors"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ErrCantFindProduct    = errors.New("can't find product")
	ErrCantDecodeProducts = errors.New("can't decode products")
	ErrUserIDIsNotValid   = errors.New("user ID is not valid")
	ErrCantUpdateCart     = errors.New("cannot update cart")
	ErrCantGetCart        = errors.New("cannot retrieve cart")
)

type CartRepo interface {
	AddProductToCart(ctx context.Context, productID primitive.ObjectID, userID string, quantity int) error
}

type CartRepoI struct {
	db *mongo.Database
}

func NewCartRepo(db *mongo.Database) CartRepo {
	return &CartRepoI{db: db}
}

func (c *CartRepoI) AddProductToCart(ctx context.Context, productID primitive.ObjectID, userID string, quantity int) error {
	if quantity <= 0 {
		log.Println("Invalid quantity:", quantity)
		return errors.New("quantity must be greater than zero")
	}

	// Validate user ID
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		log.Println("Invalid user ID:", err)
		return ErrUserIDIsNotValid
	}

	// Check if product exists
	var product model.Product
	err = c.db.Collection("products").FindOne(ctx, bson.M{"_id": productID}).Decode(&product)
	if err != nil {
		log.Printf("Product with ID %s not found: %v", productID.Hex(), err)
		return ErrCantFindProduct
	}

	// Ensure the cart exists for the user
	_, err = c.db.Collection("carts").UpdateOne(
		ctx,
		bson.M{"_id": userObjectID},
		bson.M{
			"$setOnInsert": bson.M{
				"_id":        userObjectID,
				"cart_id":    "cart_" + userObjectID.Hex(),
				"line_items": []model.LineItem{},
			},
		},
		options.Update().SetUpsert(true),
	)
	if err != nil {
		log.Printf("Error ensuring cart document exists: %v", err)
		return ErrCantUpdateCart
	}

	// Try to update the quantity of an existing product in the cart
	filter := bson.M{"_id": userObjectID, "line_items.product_id": productID}
	update := bson.M{
		"$inc": bson.M{
			"line_items.$.quantity": quantity,
			"line_items.$.subtotal": product.Price * quantity,
		},
	}
	result, err := c.db.Collection("carts").UpdateOne(ctx, filter, update)
	if err != nil {
		log.Println("Error updating cart:", err)
		return ErrCantUpdateCart
	}

	// If no existing product was updated, add a new product to the cart
	if result.ModifiedCount == 0 {
		newLineItem := model.LineItem{
			ID:        primitive.NewObjectID().Hex(),
			ProductID: productID.Hex(),
			Quantity:  quantity,
			Price:     product.Price,
			Subtotal:  float64(product.Price) * float64(product.Quantity),
		}
		pushUpdate := bson.M{
			"$push": bson.M{"line_items": newLineItem},
		}
		_, err = c.db.Collection("carts").UpdateOne(ctx, bson.M{"_id": userObjectID}, pushUpdate)
		if err != nil {
			log.Printf("Error adding new item to cart: %v", err)
			return ErrCantUpdateCart
		}
	}

	log.Printf("Successfully added product %s to user %s's cart", productID.Hex(), userID)
	return nil
}
