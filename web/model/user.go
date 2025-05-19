package model

import (
	"time"

	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}

type User struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	First_Name    string             `bson:"first_name" json:"first_name"`
	Last_Name     string             `bson:"last_name" json:"last_name"`
	Email         string             `bson:"email,unique" json:"email"`
	Password      string             `bson:"password" json:"password"`
	Address       string             `bson:"address" json:"address"`
	PhoneNumber   string             `bson:"phone_number" json:"phone_number"`
	Role          string             `bson:"role" json:"role"`
	User_ID       string             `json:"user_id"`
	UserImage_URL string             `bson:"userimage_url" json:"userimage_url"`
	Created_At    time.Time          `bson:"created_at" json:"created_at"`
	Updated_At    time.Time          `bson:"updated_at" json:"updated_at"`
	Deleted_At    time.Time          `bson:"deleted_at" json:"deleted_at"`
}
type SignedDetails struct {
	Email      string `json:"email"`
	First_Name string `json:"first_name"`
	Last_Name  string `json:"last_name"`
	Uid        string `json:"uid"`
	jwt.StandardClaims
}

type UserResponse struct {
	Id         string `json:"_id,omitempty" bson:"_id,omitempty"`
	First_Name string `bson:"first_name" json:"first_name"`
	Last_Name  string `bson:"last_name" json:"last_name"`
	Email      string `json:"email,omitempty" bson:"email,unique"`
	Password   string `json:"password,omitempty" bson:"password,omitempty"`
	Image_URL  string `json:"userimage_url,omitempty" bson:"userimage_url,omitempty"`
}

type User_KhachHang struct {
	User_ID    string    `json:"_id,omitempty" bson:"_id,omitempty"`
	Email      string    `bson:"email" json:"email"`
	Password   string    `bson:"password" json:"password"`
	Birthday   string    `bson:"birthday" json:"birthday"`
	Gender     string    `bson:"gender" json:"gender"`
	Role       string    `bson:"role" json:"role"`
	Status     string    `bson:"status" json:"status"`
	Created_At time.Time `json:"created_at" bson:"created_at"`
	Updated_At time.Time `json:"updated_at" bson:"updated_at"`
}
