package reponsitory

import (
	"context"
	"time"

	"DoAnToiNghiep/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProductRepo interface {
	GetAll(ctx context.Context) ([]model.Product_SanPham, error)
	FindByID(ctx context.Context, id string) (model.Product_SanPham, error)
	FindByCategory(ctx context.Context, categoryID string) ([]model.Product_SanPham, error)
	Create(ctx context.Context, product model.Product_SanPham) (model.Product_SanPham, error)
	Update(ctx context.Context, product model.Product_SanPham) (model.Product_SanPham, error)
	Delete(ctx context.Context, id string) error
}

type ProductRepoI struct {
	DB *mongo.Database
}

func NewProductRepo(DB *mongo.Database) ProductRepo {
	return &ProductRepoI{DB: DB}
}

func (p *ProductRepoI) GetAll(ctx context.Context) ([]model.Product_SanPham, error) {
	var products []model.Product_SanPham
	cursor, err := p.DB.Collection("products").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	if err := cursor.All(ctx, &products); err != nil {
		return nil, err
	}
	return products, nil
}

func (p *ProductRepoI) FindByID(ctx context.Context, id string) (model.Product_SanPham, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return model.Product_SanPham{}, err
	}
	var product model.Product_SanPham
	err = p.DB.Collection("products").FindOne(ctx, bson.M{"product_id": objID}).Decode(&product)
	if err != nil {
		return model.Product_SanPham{}, err
	}
	return product, nil
}

func (p *ProductRepoI) FindByCategory(ctx context.Context, categoryID string) ([]model.Product_SanPham, error) {
	var products []model.Product_SanPham
	cursor, err := p.DB.Collection("products").Find(ctx, bson.M{"id_category": categoryID})
	if err != nil {
		return nil, err
	}
	if err := cursor.All(ctx, &products); err != nil {
		return nil, err
	}
	return products, nil
}

func (p *ProductRepoI) Create(ctx context.Context, product model.Product_SanPham) (model.Product_SanPham, error) {
	product.Created_At = time.Now()
	product.Updated_At = time.Now()

	_, err := p.DB.Collection("products").InsertOne(ctx, product)
	if err != nil {
		return model.Product_SanPham{}, err
	}
	return product, nil
}

func (p *ProductRepoI) Update(ctx context.Context, product model.Product_SanPham) (model.Product_SanPham, error) {
	product.Updated_At = time.Now()

	filter := bson.M{"product_id": product.Product_ID}
	update := bson.M{
		"$set": bson.M{
			"id_producer": product.ID_Producer,
			"id_category": product.ID_Category,
			"name":        product.Name,
			"description": product.Description,
			"information": product.Information,
			"price":       product.Price,
			"status":      product.Status,
			"updated_at":  product.Updated_At,
		},
	}

	result, err := p.DB.Collection("products").UpdateOne(ctx, filter, update)
	if err != nil {
		return model.Product_SanPham{}, err
	}
	if result.MatchedCount == 0 {
		return model.Product_SanPham{}, mongo.ErrNoDocuments
	}
	return product, nil
}

func (p *ProductRepoI) Delete(ctx context.Context, id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	result, err := p.DB.Collection("products").DeleteOne(ctx, bson.M{"product_id": objID})
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}
