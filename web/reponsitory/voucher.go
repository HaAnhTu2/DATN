package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type VoucherRepo interface {
	GetAll(ctx context.Context) ([]model.Voucher_MaGiamGia, error)
	GetByID(ctx context.Context, id primitive.ObjectID) (model.Voucher_MaGiamGia, error)
	Create(ctx context.Context, voucher model.Voucher_MaGiamGia) (model.Voucher_MaGiamGia, error)
	Update(ctx context.Context, voucher model.Voucher_MaGiamGia) (model.Voucher_MaGiamGia, error)
	Delete(ctx context.Context, voucherID primitive.ObjectID) error
}
type VoucherRepoI struct {
	db *mongo.Database
}

func NewVoucherRepo(db *mongo.Database) VoucherRepo {
	return &VoucherRepoI{db: db}
}

func (v *VoucherRepoI) GetByID(ctx context.Context, id primitive.ObjectID) (model.Voucher_MaGiamGia, error) {
	var voucher model.Voucher_MaGiamGia
	err := v.db.Collection("vouchers").FindOne(ctx, bson.M{"voucher_id": id}).Decode(&voucher)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.Voucher_MaGiamGia{}, err
		}
		return model.Voucher_MaGiamGia{}, err
	}
	return voucher, nil
}

func (v *VoucherRepoI) GetAll(ctx context.Context) ([]model.Voucher_MaGiamGia, error) {
	var vouchers []model.Voucher_MaGiamGia

	cursor, err := v.db.Collection("vouchers").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var voucher model.Voucher_MaGiamGia
		if err := cursor.Decode(&voucher); err != nil {
			return nil, err
		}
		vouchers = append(vouchers, voucher)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return vouchers, nil
}

func (v *VoucherRepoI) Create(ctx context.Context, voucher model.Voucher_MaGiamGia) (model.Voucher_MaGiamGia, error) {
	voucher.Voucher_ID = primitive.NewObjectID()
	voucher.Created_At = time.Now()
	voucher.Updated_At = time.Now()

	_, err := v.db.Collection("vouchers").InsertOne(ctx, voucher)
	if err != nil {
		return model.Voucher_MaGiamGia{}, err
	}

	return voucher, nil
}
func (v *VoucherRepoI) Update(ctx context.Context, voucher model.Voucher_MaGiamGia) (model.Voucher_MaGiamGia, error) {
	voucher.Updated_At = time.Now()

	update := bson.M{
		"code":            voucher.Code,
		"value":           voucher.Value,
		"min_order_value": voucher.Min_Order_Value,
		"exprired_time":   voucher.Exprired_Time,
		"description":     voucher.Description,
		"status":          voucher.Status,
		"updated_at":      voucher.Updated_At,
	}

	result, err := v.db.Collection("vouchers").UpdateOne(
		ctx,
		bson.M{"voucher_id": voucher.Voucher_ID},
		bson.M{"$set": update},
	)
	if err != nil {
		return model.Voucher_MaGiamGia{}, err
	}
	if result.MatchedCount == 0 {
		return model.Voucher_MaGiamGia{}, mongo.ErrNoDocuments
	}

	return voucher, nil
}
func (v *VoucherRepoI) Delete(ctx context.Context, voucherID primitive.ObjectID) error {
	result, err := v.db.Collection("vouchers").DeleteOne(
		ctx,
		bson.M{"voucher_id": voucherID},
	)
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}
