package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
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

func (fc *FeedbackController) CreateFeedback(c *gin.Context) {
	var feedback model.Feedback_DanhGiaSanPham
	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	feedback.Created_At = time.Now()
	feedback.Updated_At = time.Now()

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
