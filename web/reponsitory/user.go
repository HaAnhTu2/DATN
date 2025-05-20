package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepo interface {
	FindByID(ctx context.Context, id string) (model.User_KhachHang, error)
	FindByEmail(ctx context.Context, email string) (model.User_KhachHang, error)
	GetAll(ctx context.Context) ([]model.User_KhachHang, error)
	Create(ctx context.Context, user model.User_KhachHang) (model.User_KhachHang, error)
	Update(ctx context.Context, user model.User_KhachHang) (model.User_KhachHang, error)
	Delete(ctx context.Context, id string) error
	SaveToken(user *model.User_KhachHang) (string, error)
}

type UserRepoI struct {
	db *mongo.Database
}

func NewUserRepo(db *mongo.Database) UserRepo {
	return &UserRepoI{db: db}
}

func (u *UserRepoI) FindByID(ctx context.Context, id string) (model.User_KhachHang, error) {
	var user model.User_KhachHang
	err := u.db.Collection("users").FindOne(ctx, bson.M{"user_id": id}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.User_KhachHang{}, errors.New("user not found")
		}
		return model.User_KhachHang{}, err
	}
	return user, nil
}

func (u *UserRepoI) FindByEmail(ctx context.Context, email string) (model.User_KhachHang, error) {
	var user model.User_KhachHang
	err := u.db.Collection("users").FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.User_KhachHang{}, errors.New("user not found")
		}
		return model.User_KhachHang{}, err
	}
	return user, nil
}

func (u *UserRepoI) GetAll(ctx context.Context) ([]model.User_KhachHang, error) {
	var users []model.User_KhachHang

	cursor, err := u.db.Collection("users").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var user model.User_KhachHang
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (u *UserRepoI) Create(ctx context.Context, user model.User_KhachHang) (model.User_KhachHang, error) {
	user.Created_At = time.Now()
	user.Updated_At = time.Now()

	result, err := u.db.Collection("users").InsertOne(ctx, user)
	if err != nil {
		return model.User_KhachHang{}, err
	}

	// MongoDB trả về ObjectID, lưu vào user.User_ID kiểu string
	if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
		user.User_ID = oid.Hex()
	} else if strID, ok := result.InsertedID.(string); ok {
		user.User_ID = strID
	} else {
		user.User_ID = fmt.Sprintf("%v", result.InsertedID)
	}

	return user, nil
}

func (u *UserRepoI) Update(ctx context.Context, user model.User_KhachHang) (model.User_KhachHang, error) {
	user.Updated_At = time.Now()

	update := bson.M{
		"email":      user.Email,
		"password":   user.Password,
		"birthday":   user.Birthday,
		"gender":     user.Gender,
		"role":       user.Role,
		"status":     user.Status,
		"updated_at": user.Updated_At,
	}

	result, err := u.db.Collection("users").UpdateOne(ctx, bson.M{"user_id": user.User_ID}, bson.M{"$set": update})
	if err != nil {
		return model.User_KhachHang{}, err
	}
	if result.MatchedCount == 0 {
		return model.User_KhachHang{}, mongo.ErrNoDocuments
	}
	return user, nil
}

func (u *UserRepoI) Delete(ctx context.Context, id string) error {
	result, err := u.db.Collection("users").DeleteOne(ctx, bson.M{"user_id": id})
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

func (u *UserRepoI) SaveToken(user *model.User_KhachHang) (string, error) {
	secret := os.Getenv("SECRET_KEY")
	if secret == "" {
		return "", fmt.Errorf("SECRET_KEY is not set in the environment variables")
	}

	expiredAt := time.Now().Add(15 * time.Hour)
	claims := &jwt.MapClaims{
		"sub": user.Email,
		"exp": expiredAt.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", fmt.Errorf("failed to sign the token: %v", err)
	}
	return tokenString, nil
}
