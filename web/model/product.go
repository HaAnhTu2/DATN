package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID               primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	ProductName      string             `json:"productname" bson:"productname"`
	Brand            string             `json:"brand" bson:"brand"`
	ProductType      string             `json:"producttype" bson:"producttype"`
	Quantity         int                `json:"quantity" bson:"quantity"`
	Price            int                `json:"price" bson:"price"`
	ProductImage_URL string             `json:"productimage_url" bson:"productimage_url"`
	Description      string             `json:"description" bson:"description"`
	Created_At       time.Time          `json:"created_at" bson:"created_at"`
	Updated_At       time.Time          `json:"updated_at" bson:"updated_at"`
}

type ProductResponse struct {
	ID               string `json:"_id,omitempty" bson:"_id,omitempty"`
	ProductName      string `json:"productname" bson:"productname"`
	Brand            string `json:"brand" bson:"brand"`
	ProductType      string `json:"producttype" bson:"producttype"`
	Quantity         int    `json:"quantity" bson:"quantity"`
	Price            int    `json:"price" bson:"price"`
	ProductImage_URL string `json:"productimage_url" bson:"productimage_url"`
	Description      string `json:"description" bson:"description"`
}

type Product_SanPham struct {
	Product_ID  primitive.ObjectID `json:"product_id,omitempty" bson:"product_id,omitempty"`
	ID_Producer string             `json:"id_producer" bson:"id_producer"`
	ID_Category string             `json:"id_category" bson:"id_category"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Information string             `json:"information" bson:"information"`
	Price       int                `json:"price" bson:"price"`
	Status      string             `json:"status" bson:"status"`
	Created_At  time.Time          `json:"created_at" bson:"created_at"`
	Updated_At  time.Time          `json:"updated_at" bson:"updated_at"`
}

type Product_Detail_ChiTietDonHang struct {
	Product_Detail_ID primitive.ObjectID `json:"product_detail_id,omitempty" bson:"product_detail_id,omitempty"`
	ID_Product        string             `json:"id_product" bson:"id_product"`
	Color             string             `json:"color" bson:"color"`
	Size              string             `json:"size" bson:"size"`
	Quantity          int                `json:"quantity" bson:"quantity"`
	Image             string             `json:"image" bson:"image"`
	Price             int                `json:"price" bson:"price"`
	Status            string             `json:"status" bson:"status"`
}
