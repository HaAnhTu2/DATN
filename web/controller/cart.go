package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"context"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CartController struct {
	CartRepo reponsitory.CartRepo
	DB       *mongo.Database
}

func NewCartController(CartRepo reponsitory.CartRepo, db *mongo.Database) *CartController {
	return &CartController{CartRepo: CartRepo,
		DB: db}
}
func (ca *CartController) AddToCart(c *gin.Context) {
	productQueryID := c.Param("id")
	if productQueryID == "" {
		log.Println("product id is empty")
		_ = c.AbortWithError(http.StatusBadRequest, errors.New("product id is empty"))
		return
	}
	userQueryID := c.Param("userID")
	if userQueryID == "" {
		log.Println("user id is empty")
		_ = c.AbortWithError(http.StatusBadRequest, errors.New("user id is empty"))
		return
	}
	var request model.LineItemRequest
	if err := c.BindJSON(&request); err != nil {
		log.Println("Invalid JSON body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	// Lấy giá trị cartquantity
	cartquantity := request.CartQuantity

	productID, err := primitive.ObjectIDFromHex(productQueryID)
	if err != nil {
		log.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = ca.CartRepo.AddProductToCart(ctx, productID, userQueryID, cartquantity)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully added to the cart"})
}
