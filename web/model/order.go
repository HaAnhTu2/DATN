package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Order struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID    string             `bson:"user_id" json:"user_id"`
	LineItems []LineItem         `bson:"line_items" json:"line_items"`
}

type Payment struct {
	Digital bool
	COD     bool
}
