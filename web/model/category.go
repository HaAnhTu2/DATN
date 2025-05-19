package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Category_LoaiSanPham struct {
	Category_ID primitive.ObjectID `bson:"category_id,omitempty" json:"category_id,omitempty"`
	Name        string             `bson:"name" json:"name"`
	Status      string             `bson:"status" json:"status"`
	Created_At  time.Time          `json:"created_at" bson:"created_at"`
	Updated_At  time.Time          `json:"updated_at" bson:"updated_at"`
}
