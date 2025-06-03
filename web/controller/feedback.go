package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"bytes"
	"context"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type FeedbackController struct {
	FeedbackRepo reponsitory.FeedbackRepo
	DB           *mongo.Database
}

func NewFeedbackController(FeedbackRepo reponsitory.FeedbackRepo, db *mongo.Database) *FeedbackController {
	return &FeedbackController{
		FeedbackRepo: FeedbackRepo,
		DB:           db,
	}
}

func (fc *FeedbackController) GetAllFeedback(c *gin.Context) {
	feedbacks, err := fc.FeedbackRepo.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"data": feedbacks})
}

func (f *FeedbackController) GetFeedbackByProductID(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	productID := c.Param("id")
	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	feedbacks, err := f.FeedbackRepo.GetByProductID(ctx, productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get feedbacks: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, feedbacks)
}

func (fc *FeedbackController) CreateFeedback(c *gin.Context) {
	var feedback model.Feedback_DanhGiaSanPham
	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&feedback); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else {
		feedback.ID_User = c.PostForm("id_user")
		feedback.ID_Product = c.PostForm("id_product")
		feedback.Rate = c.PostForm("rate")
		feedback.Description = c.PostForm("description")
	}

	feedback.Created_At = time.Now()
	feedback.Updated_At = time.Now()
	// 3. Upload image
	file, header, err := c.Request.FormFile("image")
	if err != nil || file == nil || header == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image upload failed"})
		return
	}
	defer file.Close()

	bucket, err := gridfs.NewBucket(fc.DB, options.GridFSBucket().SetName("feedback"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create GridFS bucket"})
		return
	}

	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read image"})
		return
	}

	filename := time.Now().Format("20060102150405") + "_" + header.Filename
	uploadStream, err := bucket.OpenUploadStream(filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open GridFS upload stream"})
		return
	}
	defer uploadStream.Close()

	if _, err := uploadStream.Write(buf.Bytes()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write to GridFS"})
		return
	}

	imageID := ""
	if oid, ok := uploadStream.FileID.(primitive.ObjectID); ok {
		imageID = oid.Hex()
	}
	feedback.Image = imageID
	created, err := fc.FeedbackRepo.Create(c.Request.Context(), feedback)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create feedback"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"feedback": created})
}

func (fc *FeedbackController) UpdateFeedback(c *gin.Context) {
	var feedback model.Feedback_DanhGiaSanPham
	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	feedback.Updated_At = time.Now()

	updated, err := fc.FeedbackRepo.Update(c.Request.Context(), feedback)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update feedback"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"feedback": updated})
}

func (fc *FeedbackController) DeleteFeedback(c *gin.Context) {
	idUser := c.Param("id_user")
	idProduct := c.Param("id_product")
	if idUser == "" || idProduct == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing id_user or id_product"})
		return
	}
	err := fc.FeedbackRepo.Delete(c.Request.Context(), idUser, idProduct)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete feedback"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Feedback deleted successfully"})
}

func (fc *FeedbackController) ServeImageFeedback(c *gin.Context) {
	imageId := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(imageId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID ảnh không hợp lệ"})
		return
	}

	bucket, err := gridfs.NewBucket(fc.DB, options.GridFSBucket().SetName("feedback"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo bucket"})
		return
	}

	var buf bytes.Buffer
	_, err = bucket.DownloadToStream(objID, &buf)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không thể tìm thấy ảnh"})
		return
	}

	contentType := http.DetectContentType(buf.Bytes())
	c.Writer.Header().Set("Content-Type", contentType)
	c.Writer.Header().Set("Content-Length", strconv.Itoa(len(buf.Bytes())))
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(buf.Bytes())
}
