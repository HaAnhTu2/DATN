package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Producer_NhaSanXuat struct {
	Producer_ID primitive.ObjectID `bson:"producer_id,omitempty" json:"producer_id,omitempty"`
	Name        string             `bson:"name" json:"name"`
	Status      string             `bson:"status" json:"status"`
	Created_At  time.Time          `json:"created_at" bson:"created_at"`
	Updated_At  time.Time          `json:"updated_at" bson:"updated_at"`
}
