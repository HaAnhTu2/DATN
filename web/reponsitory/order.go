package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderRepository interface {
	CreateOrder(ctx context.Context, order model.Order) (model.Order, error)
}

type OrderRepo struct {
	DB *mongo.Database
}

func NewOrderRepo(db *mongo.Database) OrderRepository {
	return &OrderRepo{DB: db}
}

// Create a new order
func (r *OrderRepo) CreateOrder(ctx context.Context, order model.Order) (model.Order, error) {
	result, err := r.DB.Collection("orders").InsertOne(ctx, order)
	if err != nil {
		return model.Order{}, err
	}
	order.ID = result.InsertedID.(primitive.ObjectID)
	return order, nil
}
