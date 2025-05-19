package model

import (
	"time"
)

type Feedback_DanhGiaSanPham struct {
	ID_User     string    `bson:"id_user,omitempty" json:"id_user,omitempty"`
	ID_Product  string    `bson:"id_product,omitempty" json:"id_product,omitempty"`
	Rate        string    `bson:"rate" json:"rate"`
	Description string    `bson:"description" json:"description"`
	Image       string    `bson:"image" json:"image"`
	Created_At  time.Time `json:"created_at" bson:"created_at"`
	Updated_At  time.Time `json:"updated_at" bson:"updated_at"`
}
