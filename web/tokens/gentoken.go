package token

import (
	"context"
	"log"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SignedDetails struct {
	Email     string
	FirstName string
	LastName  string
	Uid       string
	jwt.StandardClaims
}

var SECRET_KEY = os.Getenv("SECRET_KEY")

// Tạo JWT và Refresh Token
func TokenGenerator(email, firstname, lastname, uid string) (string, string, error) {
	claims := &SignedDetails{
		Email:     email,
		FirstName: firstname,
		LastName:  lastname,
		Uid:       uid,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
		},
	}

	refreshClaims := &jwt.StandardClaims{
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour).Unix(),
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}

	return token, refreshToken, nil
}

// Xác thực JWT
func ValidateToken(signedToken string) (*SignedDetails, string) {
	token, err := jwt.ParseWithClaims(signedToken, &SignedDetails{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SECRET_KEY), nil
	})

	if err != nil {
		return nil, "Invalid token: " + err.Error()
	}

	claims, ok := token.Claims.(*SignedDetails)
	if !ok || !token.Valid {
		return nil, "Invalid token"
	}

	if claims.ExpiresAt < time.Now().Unix() {
		return nil, "Token has expired"
	}

	return claims, ""
}

// Cập nhật token trong cơ sở dữ liệu
func UpdateAllTokens(signedToken, refreshToken, userID string, userDataCollection *mongo.Collection) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	updateObj := bson.M{
		"token":         signedToken,
		"refresh_token": refreshToken,
		"updated_at":    time.Now(),
	}

	filter := bson.M{"user_id": userID}
	opts := options.Update().SetUpsert(true)

	_, err := userDataCollection.UpdateOne(ctx, filter, bson.M{"$set": updateObj}, opts)
	if err != nil {
		log.Printf("Error updating tokens for user %s: %v", userID, err)
	}
}
