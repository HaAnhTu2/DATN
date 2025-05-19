package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Voucher_MaGiamGia struct {
	Voucher_ID      primitive.ObjectID `bson:"voucher_id,omitempty" json:"voucher_id,omitempty"`
	Code            string             `bson:"code" json:"code"`
	Value           string             `bson:"value" json:"value"`
	Min_Order_Value int                `bson:"min_order_value" json:"min_order_value"`
	Exprired_Time   time.Time          `bson:"exprired_time" json:"exprired_time"`
	Description     string             `bson:"description" json:"description"`
	Status          string             `bson:"status" json:"status"`
	Created_At      time.Time          `bson:"created_at" json:"created_at"`
	Updated_At      time.Time          `bson:"updated_at" json:"updated_at"`
}
