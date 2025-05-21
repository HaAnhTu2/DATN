package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CategoryRepo interface {
	FindByID(ctx context.Context, id string) (model.Category_LoaiSanPham, error)
	Create(ctx context.Context, category model.Category_LoaiSanPham) (model.Category_LoaiSanPham, error)
	Update(ctx context.Context, user model.Category_LoaiSanPham) (model.Category_LoaiSanPham, error)
	Delete(ctx context.Context, id string) error
}
type CategoryRepoI struct {
	db *mongo.Database
}

func NewCategoryRepo(db *mongo.Database) CategoryRepo {
	return &CategoryRepoI{db: db}
}

func (u *CategoryRepoI) FindByID(ctx context.Context, id string) (model.Category_LoaiSanPham, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return model.Category_LoaiSanPham{}, errors.New("invalid category ID")
	}
	var category model.Category_LoaiSanPham
	err = u.db.Collection("category").FindOne(ctx, bson.M{"_id": objID}).Decode(&category)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.Category_LoaiSanPham{}, errors.New("category not found")
		}
		return model.Category_LoaiSanPham{}, err
	}
	return category, nil
}

func (c *CategoryRepoI) Create(ctx context.Context, category model.Category_LoaiSanPham) (model.Category_LoaiSanPham, error) {
	result, err := c.db.Collection("category").InsertOne(ctx, category)
	if err != nil {
		return model.Category_LoaiSanPham{}, err
	}
	category.Category_ID = result.InsertedID.(primitive.ObjectID)
	return category, nil
}

func (c *CategoryRepoI) Update(ctx context.Context, category model.Category_LoaiSanPham) (model.Category_LoaiSanPham, error) {
	result, err := c.db.Collection("category").UpdateOne(ctx, bson.M{"category_id": category.Category_ID}, bson.M{
		"$set": bson.M{
			"name":   category.Name,
			"status": category.Status,
		}})
	if err != nil {
		return model.Category_LoaiSanPham{}, err
	}
	if result.MatchedCount == 0 {
		return model.Category_LoaiSanPham{}, mongo.ErrNoDocuments
	}
	return category, nil
}
func (c *CategoryRepoI) Delete(ctx context.Context, id string) error {
	ID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	result, err := c.db.Collection("category").DeleteOne(ctx, bson.M{"category_id": ID})
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return err
	}
	return nil
}
