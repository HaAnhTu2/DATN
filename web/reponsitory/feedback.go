package reponsitory

import (
	"DoAnToiNghiep/model"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type FeedbackRepo interface {
	GetAll(ctx context.Context) ([]model.Feedback_DanhGiaSanPham, error)
	Create(ctx context.Context, feedback model.Feedback_DanhGiaSanPham) (model.Feedback_DanhGiaSanPham, error)
	Update(ctx context.Context, user model.Feedback_DanhGiaSanPham) (model.Feedback_DanhGiaSanPham, error)
	Delete(ctx context.Context, idUser string, idProduct string) error
}
type FeedbackRepoI struct {
	db *mongo.Database
}

func NewFeedbackRepo(db *mongo.Database) FeedbackRepo {
	return &FeedbackRepoI{db: db}
}

func (f *FeedbackRepoI) GetAll(ctx context.Context) ([]model.Feedback_DanhGiaSanPham, error) {
	var feedbacks []model.Feedback_DanhGiaSanPham
	cursor, err := f.db.Collection("feedback").Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &feedbacks); err != nil {
		return nil, err
	}
	return feedbacks, nil
}

func (f *FeedbackRepoI) Create(ctx context.Context, feedback model.Feedback_DanhGiaSanPham) (model.Feedback_DanhGiaSanPham, error) {
	_, err := f.db.Collection("feedback").InsertOne(ctx, feedback)
	if err != nil {
		return model.Feedback_DanhGiaSanPham{}, err
	}
	return feedback, nil
}

func (f *FeedbackRepoI) Update(ctx context.Context, feedback model.Feedback_DanhGiaSanPham) (model.Feedback_DanhGiaSanPham, error) {
	// Cập nhật thời gian
	feedback.Updated_At = time.Now()

	// Tạo dữ liệu cập nhật
	update := bson.M{
		"rate":        feedback.Rate,
		"description": feedback.Description,
		"image":       feedback.Image,
		"updated_at":  feedback.Updated_At,
	}

	// Thực hiện update
	result, err := f.db.Collection("feedback").UpdateOne(
		ctx,
		bson.M{
			"id_user":    feedback.ID_User,
			"id_product": feedback.ID_Product,
		},
		bson.M{"$set": update},
	)

	if err != nil {
		return model.Feedback_DanhGiaSanPham{}, err
	}
	if result.MatchedCount == 0 {
		return model.Feedback_DanhGiaSanPham{}, mongo.ErrNoDocuments
	}

	return feedback, nil
}

func (f *FeedbackRepoI) Delete(ctx context.Context, idUser string, idProduct string) error {
	result, err := f.db.Collection("feedback").DeleteOne(
		ctx,
		bson.M{
			"id_user":    idUser,
			"id_product": idProduct,
		},
	)

	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}
