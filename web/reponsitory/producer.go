package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProducerRepo interface {
	GetAll(ctx context.Context) ([]model.Producer_NhaSanXuat, error)
	FindByID(ctx context.Context, id primitive.ObjectID) (model.Producer_NhaSanXuat, error)
	Create(ctx context.Context, producer model.Producer_NhaSanXuat) (model.Producer_NhaSanXuat, error)
	Update(ctx context.Context, producer model.Producer_NhaSanXuat) (model.Producer_NhaSanXuat, error)
	Delete(ctx context.Context, producerID primitive.ObjectID) error
}

type ProducerRepoI struct {
	db *mongo.Database
}

func NewProducerRepo(db *mongo.Database) ProducerRepo {
	return &ProducerRepoI{db: db}
}
func (p *ProducerRepoI) GetAll(ctx context.Context) ([]model.Producer_NhaSanXuat, error) {
	var producers []model.Producer_NhaSanXuat

	cursor, err := p.db.Collection("producers").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var producer model.Producer_NhaSanXuat
		if err := cursor.Decode(&producer); err != nil {
			return nil, err
		}
		producers = append(producers, producer)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return producers, nil
}

func (p *ProducerRepoI) FindByID(ctx context.Context, id primitive.ObjectID) (model.Producer_NhaSanXuat, error) {
	var producer model.Producer_NhaSanXuat
	err := p.db.Collection("producers").FindOne(ctx, bson.M{"producer_id": id}).Decode(&producer)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.Producer_NhaSanXuat{}, errors.New("user not found")
		}
		return model.Producer_NhaSanXuat{}, err
	}
	return producer, nil
}

func (p *ProducerRepoI) Create(ctx context.Context, producer model.Producer_NhaSanXuat) (model.Producer_NhaSanXuat, error) {
	producer.Producer_ID = primitive.NewObjectID()
	producer.Created_At = time.Now()
	producer.Updated_At = time.Now()

	_, err := p.db.Collection("producers").InsertOne(ctx, producer)
	if err != nil {
		return model.Producer_NhaSanXuat{}, err
	}

	return producer, nil
}
func (p *ProducerRepoI) Update(ctx context.Context, producer model.Producer_NhaSanXuat) (model.Producer_NhaSanXuat, error) {
	update := bson.M{
		"$set": bson.M{
			"name":   producer.Name,
			"status": producer.Status,
		}}

	result, err := p.db.Collection("producers").UpdateOne(
		ctx,
		bson.M{"producer_id": producer.Producer_ID},
		update)
	if err != nil {
		return model.Producer_NhaSanXuat{}, err
	}
	if result.MatchedCount == 0 {
		return model.Producer_NhaSanXuat{}, mongo.ErrNoDocuments
	}

	return producer, nil
}
func (p *ProducerRepoI) Delete(ctx context.Context, producerID primitive.ObjectID) error {
	result, err := p.db.Collection("producers").DeleteOne(
		ctx,
		bson.M{"producer_id": producerID},
	)
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}
