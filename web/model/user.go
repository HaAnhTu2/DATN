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
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	First_Name    string             `bson:"firstname" json:"firstname"`
	Last_Name     string             `bson:"lastname" json:"lastname"`
	Email         string             `bson:"email,unique" json:"email"`
	Password      string             `bson:"password" json:"password"`
	Address       string             `bson:"address" json:"address"`
	PhoneNumber   string             `bson:"phone_number" json:"phone_number"`
	Role          string             `bson:"role" json:"role"`
	Token         string             `json:"token"`
	Refresh_Token string             `josn:"refresh_token"`
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
	First_Name string `bson:"firstname" json:"firstname"`
	Last_Name  string `bson:"lastname" json:"lastname"`
	Email      string `json:"email,omitempty" bson:"email,unique"`
	Password   string `json:"password,omitempty" bson:"password,omitempty"`
	Image_URL  string `json:"userimage_url,omitempty" bson:"userimage_url,omitempty"`
}
