package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProducerController struct {
	ProducerRepo reponsitory.ProducerRepo
}

func NewProducerController(repo reponsitory.ProducerRepo) *ProducerController {
	return &ProducerController{
		ProducerRepo: repo,
	}
}
func (pc *ProducerController) GetAllProducer(c *gin.Context) {
	producers, err := pc.ProducerRepo.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"producers": producers})
}

func (pc *ProducerController) GetProducerByID(c *gin.Context) {
	id := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Print("err", err)
	}
	producer, err := pc.ProducerRepo.FindByID(ctx, objID)
	if err != nil {
		if err.Error() == "producer not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy nhà sản xuất"})
		} else if err.Error() == "invalid producer ID" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi server khi tìm producer"})
		}
		return
	}

	c.JSON(http.StatusOK, producer)
}

// Create producer
func (pc *ProducerController) CreateProducer(c *gin.Context) {
	var producer model.Producer_NhaSanXuat
	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&producer); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else {
		producer.Name = c.PostForm("name")
		producer.Status = c.PostForm("status")
	}

	producer.Producer_ID = primitive.NewObjectID()
	producer.Created_At = time.Now()
	producer.Updated_At = time.Now()

	created, err := pc.ProducerRepo.Create(c.Request.Context(), producer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo nhà sản xuất"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"producer": created})
}

// Update producer
func (pc *ProducerController) UpdateProducer(c *gin.Context) {
	id := c.Param("producer_id")

	producerID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "producer_id không hợp lệ"})
		return
	}

	producer, err := pc.ProducerRepo.FindByID(c.Request.Context(), producerID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Nhà sản xuất không tồn tại"})
		return
	}

	if producerName := c.PostForm("name"); producerName != "" {
		producer.Name = producerName
	}
	if producerStatus := c.PostForm("status"); producerStatus != "" {
		producer.Status = producerStatus
	}
	producer.Updated_At = time.Now()
	log.Print(producer)
	updated, err := pc.ProducerRepo.Update(c.Request.Context(), producer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật nhà sản xuất"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"producer": updated})
}

// Delete producer
func (pc *ProducerController) DeleteProducer(c *gin.Context) {
	id := c.Param("producer_id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu producer_id"})
		return
	}

	producerID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "producer_id không hợp lệ"})
		return
	}

	err = pc.ProducerRepo.Delete(c.Request.Context(), producerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xoá nhà sản xuất"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Xoá nhà sản xuất thành công"})
}
