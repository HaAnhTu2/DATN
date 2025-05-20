package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProductDetailRepo interface {
	Create(ctx context.Context, detail model.Product_Detail_ChiTietDonHang) (*model.Product_Detail_ChiTietDonHang, error)
	FindByID(ctx context.Context, id string) (*model.Product_Detail_ChiTietDonHang, error)
	FindByProductID(ctx context.Context, productID string) (model.Product_Detail_ChiTietDonHang, error)
	Update(ctx context.Context, detail model.Product_Detail_ChiTietDonHang) (model.Product_Detail_ChiTietDonHang, error)
	Delete(ctx context.Context, id string) error
}

type ProductDetailRepoI struct {
	Collection *mongo.Collection
}

func NewProductDetailRepo(db *mongo.Database) ProductDetailRepo {
	return &ProductDetailRepoI{
		Collection: db.Collection("product_details"),
	}
}

func (r *ProductDetailRepoI) Create(ctx context.Context, detail model.Product_Detail_ChiTietDonHang) (*model.Product_Detail_ChiTietDonHang, error) {
	detail.Product_Detail_ID = primitive.NewObjectID()
	_, err := r.Collection.InsertOne(ctx, detail)
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
	err = r.Collection.FindOne(ctx, bson.M{"product_detail_id": objID}).Decode(&detail)
	if err != nil {
		return nil, err
	}
	return &detail, nil
}

func (r *ProductDetailRepoI) FindByProductID(ctx context.Context, productID string) (model.Product_Detail_ChiTietDonHang, error) {
	var detail model.Product_Detail_ChiTietDonHang
	filter := bson.M{"id_product": productID}
	err := r.Collection.FindOne(ctx, filter).Decode(&detail)
	if err != nil {
		return detail, err
	}
	return detail, nil
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
	_, err := r.Collection.UpdateOne(ctx, filter, update)
	return detail, err
}

func (r *ProductDetailRepoI) Delete(ctx context.Context, id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.Collection.DeleteOne(ctx, bson.M{"product_detail_id": objID})
	return err
}
