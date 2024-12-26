package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type LineItem struct {
	ID           string  `bson:"id" json:"id"`
	ProductID    string  `bson:"product_id" json:"product_id"`
	CartQuantity int     `bson:"cartquantity" json:"cartquantity"`
	Price        int     `bson:"price" json:"price"`
	Subtotal     float64 `bson:"subtotal" json:"subtotal"`
}

type Cart struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	CartID    string             `bson:"cart_id" json:"cart_id"`
	LineItems []LineItem         `bson:"line_items" json:"line_items"`
}
type LineItemRequest struct {
	CartQuantity int `json:"cartquantity"`
}
