package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type LineItem struct {
	ID        string  `bson:"id" json:"id"`
	ProductID string  `bson:"product_id" json:"product_id"`
	Quantity  int     `bson:"quantity" json:"quantity"`
	Price     int     `bson:"price" json:"price"`
	Subtotal  float64 `bson:"subtotal" json:"subtotal"`
}

type Cart struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	CartID    string             `bson:"cart_id" json:"cart_id"`
	LineItems []LineItem         `bson:"line_items" json:"line_items"`
}
type LineItemRequest struct {
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
}
