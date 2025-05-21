package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ErrCantFindProduct    = errors.New("Không tìm thấy sản phẩm")
	ErrCantDecodeProducts = errors.New("Không thể giải mã dữ liệu sản phẩm")
	ErrUserIDIsNotValid   = errors.New("ID người dùng không hợp lệ")
	ErrCantUpdateCart     = errors.New("Không thể cập nhật giỏ hàng")
	ErrCantGetCart        = errors.New("Không thể lấy dữ liệu giỏ hàng")
	ErrCartItemNotFound   = errors.New("Không tìm thấy sản phẩm trong giỏ hàng")
)

type CartRepo interface {
	Create(ctx context.Context, cart model.Cart_GioHang) error
	GetByUserID(ctx context.Context, userID string) ([]model.Cart_GioHang, error)
	UpdateQuantity(ctx context.Context, userID, detailID string, quantity int) error
	Delete(ctx context.Context, userID, detailID string) error
	ClearCart(ctx context.Context, userID string) error
}
type CartRepoI struct {
	db *mongo.Database
}

func NewCartRepo(db *mongo.Database) CartRepo {
	return &CartRepoI{db: db}
}

// Create hoặc tăng số lượng nếu đã tồn tại
func (c *CartRepoI) Create(ctx context.Context, cart model.Cart_GioHang) error {
	filter := bson.M{
		"id_user":           cart.ID_User,
		"id_product_detail": cart.ID_Product_Detail,
	}
	update := bson.M{
		"$inc": bson.M{"quantity": cart.Quantity},
	}
	opts := options.Update().SetUpsert(true)

	_, err := c.db.Collection("carts").UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return ErrCantUpdateCart
	}
	return nil
}

// Lấy toàn bộ giỏ hàng theo user ID
func (c *CartRepoI) GetByUserID(ctx context.Context, userID string) ([]model.Cart_GioHang, error) {
	cursor, err := c.db.Collection("carts").Find(ctx, bson.M{"id_user": userID})
	if err != nil {
		return nil, ErrCantGetCart
	}
	defer cursor.Close(ctx)

	var carts []model.Cart_GioHang
	for cursor.Next(ctx) {
		var cart model.Cart_GioHang
		if err := cursor.Decode(&cart); err != nil {
			return nil, ErrCantDecodeProducts
		}
		carts = append(carts, cart)
	}
	return carts, nil
}

// Cập nhật số lượng sản phẩm trong giỏ
func (c *CartRepoI) UpdateQuantity(ctx context.Context, userID, detailID string, quantity int) error {
	if quantity <= 0 {
		return c.Delete(ctx, userID, detailID)
	}
	filter := bson.M{
		"id_user":           userID,
		"id_product_detail": detailID,
	}
	update := bson.M{"$set": bson.M{"quantity": quantity}}

	result, err := c.db.Collection("carts").UpdateOne(ctx, filter, update)
	if err != nil {
		return ErrCantUpdateCart
	}
	if result.MatchedCount == 0 {
		return ErrCartItemNotFound
	}
	return nil
}

// Xoá một item trong giỏ
func (c *CartRepoI) Delete(ctx context.Context, userID, detailID string) error {
	_, err := c.db.Collection("carts").DeleteOne(ctx, bson.M{
		"id_user":           userID,
		"id_product_detail": detailID,
	})
	return err
}

// Xoá toàn bộ giỏ hàng của user
func (c *CartRepoI) ClearCart(ctx context.Context, userID string) error {
	_, err := c.db.Collection("carts").DeleteMany(ctx, bson.M{
		"id_user": userID,
	})
	return err
}
