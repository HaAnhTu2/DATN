package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	UserID    string             `bson:"user_id" json:"user_id"`
	LineItems []LineItem         `bson:"line_items" json:"line_items"`
}

const (
	OrderStatusPending   = "pending"
	OrderStatusPaid      = "paid"
	OrderStatusShipped   = "shipped"
	OrderStatusCompleted = "completed"
	OrderStatusCancelled = "cancelled"
)

type Order_DonHang struct {
	Order_ID        primitive.ObjectID `bson:"order_id,omitempty" json:"order_id,omitempty"`
	ID_User         string             `bson:"id_user" json:"id_user"`
	Fullname        string             `bson:"fullname" json:"fullname"`
	Phone           string             `bson:"phone" json:"phone"`
	OrderDate       time.Time          `bson:"order_date" json:"order_date"`
	ShippingAddress string             `bson:"shipping_address" json:"shipping_address"`
	ShippingMethod  string             `bson:"shipping_method" json:"shipping_method"`
	PaymentMethod   string             `bson:"payment_method" json:"payment_method"`
	TotalAmount     int                `bson:"total_amount" json:"total_amount"`
	Note            string             `bson:"note" json:"note"`
}

type Order_Detail_ChiTietDonHang struct {
	ID_Order          string `bson:"id_order,omitempty" json:"id_order,omitempty"`
	ID_Product_Detail string `bson:"id_product_detail,omitempty" json:"id_product_detail,omitempty"`
	Quantity          int    `bson:"quantity" json:"quantity"`
	Price             int    `bson:"price" json:"price"`
}
