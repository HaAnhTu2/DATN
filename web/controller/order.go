package controller

import (
	"DoAnToiNghiep/reponsitory"
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderController struct {
	OrderRepo reponsitory.OrderRepo
	DB        *mongo.Database
}

func NewOrderController(orderRepo reponsitory.OrderRepo, db *mongo.Database) *OrderController {
	return &OrderController{OrderRepo: orderRepo, DB: db}
}

func (o *OrderController) CreateOrderFromCart(c *gin.Context) {
	userID := c.Param("userID")
	if userID == "" {
		log.Println("User ID is empty")
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	order, err := o.OrderRepo.CreateOrderFromCart(ctx, userID)
	if err != nil {
		log.Printf("Error creating order: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order created successfully", "order": order})
}
