package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"errors"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ErrOrderNotFound     = errors.New("Không tìm thấy đơn hàng")
	ErrInsertOrderFailed = errors.New("Không thể tạo đơn hàng")
	ErrGetOrdersFailed   = errors.New("Không thể lấy danh sách đơn hàng")
)

type OrderRepo interface {
	CreateOrder(ctx context.Context, order model.Order_DonHang) (*mongo.InsertOneResult, error)
	CreateOrderDetails(ctx context.Context, details []model.Order_Detail_ChiTietDonHang) (*mongo.InsertManyResult, error)
	GetOrdersByUserID(ctx context.Context, userID string) ([]model.Order_DonHang, error)
	GetOrderDetails(ctx context.Context, orderID string) ([]model.Order_Detail_ChiTietDonHang, error)
	CancelOrder(ctx context.Context, orderID string) error
	GetOrderDetailsByOrderID(ctx context.Context, orderID string) ([]model.Order_Detail_ChiTietDonHang, error)
	GetAllOrders(ctx context.Context) ([]model.Order_DonHang, error)
	UpdateOrderStatus(ctx context.Context, orderID, status string) error
	DeleteOrder(ctx context.Context, orderID string) error
}

type OrderRepoI struct {
	db *mongo.Database
}

func NewOrderRepo(db *mongo.Database) OrderRepo {
	return &OrderRepoI{db: db}
}
func (r *OrderRepoI) GetAllOrders(ctx context.Context) ([]model.Order_DonHang, error) {
	var orders []model.Order_DonHang
	cursor, err := r.db.Collection("orders").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var order model.Order_DonHang
		if err := cursor.Decode(&order); err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}
	return orders, nil
}

// Create a order
func (r *OrderRepoI) CreateOrder(ctx context.Context, order model.Order_DonHang) (*mongo.InsertOneResult, error) {
	result, err := r.db.Collection("orders").InsertOne(ctx, order)
	if err != nil {
		return nil, ErrInsertOrderFailed
	}
	return result, nil
}

func (r *OrderRepoI) CreateOrderDetails(ctx context.Context, details []model.Order_Detail_ChiTietDonHang) (*mongo.InsertManyResult, error) {
	docs := make([]interface{}, len(details))
	for i, d := range details {
		docs[i] = d
	}
	result, err := r.db.Collection("order_details").InsertMany(ctx, docs)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (r *OrderRepoI) GetOrdersByUserID(ctx context.Context, userID string) ([]model.Order_DonHang, error) {
	var orders []model.Order_DonHang
	cursor, err := r.db.Collection("orders").Find(ctx, bson.M{"id_user": userID})
	if err != nil {
		return nil, ErrGetOrdersFailed
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var order model.Order_DonHang
		if err := cursor.Decode(&order); err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}
	return orders, nil
}

func (r *OrderRepoI) GetOrderDetails(ctx context.Context, orderID string) ([]model.Order_Detail_ChiTietDonHang, error) {
	var details []model.Order_Detail_ChiTietDonHang
	cursor, err := r.db.Collection("order_details").Find(ctx, bson.M{"id_order": orderID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var detail model.Order_Detail_ChiTietDonHang
		if err := cursor.Decode(&detail); err != nil {
			return nil, err
		}
		details = append(details, detail)
	}
	return details, nil
}

func (r *OrderRepoI) CancelOrder(ctx context.Context, orderID string) error {
	objID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		return err
	}

	filter := bson.M{"order_id": objID}
	update := bson.M{"$set": bson.M{"status": "cancelled"}}

	result, err := r.db.Collection("orders").UpdateOne(ctx, filter, update)
	if err != nil {
		log.Print("err: ", err)
		return err
	}
	if result.MatchedCount == 0 {
		return ErrOrderNotFound
	}
	return nil
}

func (r *OrderRepoI) UpdateOrderStatus(ctx context.Context, orderID, status string) error {
	objID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		return err
	}
	filter := bson.M{"_id": objID}
	update := bson.M{"$set": bson.M{"status": status, "updated_at": time.Now()}}
	_, err = r.db.Collection("orders").UpdateOne(ctx, filter, update)
	return err
}

func (r *OrderRepoI) DeleteOrder(ctx context.Context, orderID string) error {
	objID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		return err
	}
	_, err = r.db.Collection("orders").DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return err
	}

	// Đồng thời xoá chi tiết đơn hàng
	_, err = r.db.Collection("order_details").DeleteMany(ctx, bson.M{"id_order": orderID})
	return err
}

func (r *OrderRepoI) GetOrderDetailsByOrderID(ctx context.Context, orderID string) ([]model.Order_Detail_ChiTietDonHang, error) {
	var details []model.Order_Detail_ChiTietDonHang

	cursor, err := r.db.Collection("order_details").Find(ctx, bson.M{"id_order": orderID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var detail model.Order_Detail_ChiTietDonHang
		if err := cursor.Decode(&detail); err != nil {
			return nil, err
		}
		details = append(details, detail)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return details, nil
}
