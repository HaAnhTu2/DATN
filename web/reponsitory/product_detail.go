package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProductDetailRepo interface {
	Create(ctx context.Context, detail model.Product_Detail_ChiTietDonHang) (*model.Product_Detail_ChiTietDonHang, error)
	FindByID(ctx context.Context, id string) (*model.Product_Detail_ChiTietDonHang, error)
	FindByProductID(ctx context.Context, productID string) ([]model.Product_Detail_ChiTietDonHang, error)
	DecreaseProductDetailQuantity(ctx context.Context, productDetailID string, quantity int) error
	Update(ctx context.Context, detail model.Product_Detail_ChiTietDonHang) (model.Product_Detail_ChiTietDonHang, error)
	Delete(ctx context.Context, id string) error
}

type ProductDetailRepoI struct {
	DB *mongo.Database
}

func NewProductDetailRepo(db *mongo.Database) ProductDetailRepo {
	return &ProductDetailRepoI{DB: db}
}

func (r *ProductDetailRepoI) Create(ctx context.Context, detail model.Product_Detail_ChiTietDonHang) (*model.Product_Detail_ChiTietDonHang, error) {
	detail.Product_Detail_ID = primitive.NewObjectID()
	_, err := r.DB.Collection("product_details").InsertOne(ctx, detail)
	if err != nil {
		return nil, err
	}
	return &detail, nil
}

func (r *ProductDetailRepoI) FindByID(ctx context.Context, id string) (*model.Product_Detail_ChiTietDonHang, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var detail model.Product_Detail_ChiTietDonHang
	err = r.DB.Collection("product_details").FindOne(ctx, bson.M{"product_detail_id": objID}).Decode(&detail)
	if err != nil {
		return nil, err
	}
	return &detail, nil
}

func (r *ProductDetailRepoI) FindByProductID(ctx context.Context, productID string) ([]model.Product_Detail_ChiTietDonHang, error) {
	var details []model.Product_Detail_ChiTietDonHang

	filter := bson.M{"id_product": productID}
	cursor, err := r.DB.Collection("product_details").Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var detail model.Product_Detail_ChiTietDonHang
		if err := cursor.Decode(&detail); err != nil {
			return nil, err
		}
		details = append(details, detail)
	}
	return details, nil
}

func (r *ProductDetailRepoI) DecreaseProductDetailQuantity(ctx context.Context, productDetailID string, quantity int) error {
	objID, err := primitive.ObjectIDFromHex(productDetailID)
	if err != nil {
		return err
	}

	filter := bson.M{"product_detail_id": objID}
	update := bson.M{
		"$inc": bson.M{
			"quantity": -quantity,
		},
	}

	result, err := r.DB.Collection("product_details").UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("Không tìm thấy sản phẩm chi tiết")
	}

	return nil
}

func (r *ProductDetailRepoI) Update(ctx context.Context, detail model.Product_Detail_ChiTietDonHang) (model.Product_Detail_ChiTietDonHang, error) {
	filter := bson.M{"product_detail_id": detail.Product_Detail_ID}
	update := bson.M{
		"$set": bson.M{
			"color":    detail.Color,
			"size":     detail.Size,
			"quantity": detail.Quantity,
			"image":    detail.Image,
			"price":    detail.Price,
			"status":   detail.Status,
		},
	}
	_, err := r.DB.Collection("product_details").UpdateOne(ctx, filter, update)
	return detail, err
}

func (r *ProductDetailRepoI) Delete(ctx context.Context, id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.DB.Collection("product_details").DeleteOne(ctx, bson.M{"product_detail_id": objID})
	return err
}
