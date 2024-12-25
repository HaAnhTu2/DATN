package controller

import (
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
	productQueryID := c.Query("id")
	if productQueryID == "" {
		log.Println("product id is empty")
		_ = c.AbortWithError(http.StatusBadRequest, errors.New("product id is empty"))
		return
	}
	userQueryID := c.Query("userID")
	if userQueryID == "" {
		log.Println("user id is empty")
		_ = c.AbortWithError(http.StatusBadRequest, errors.New("user id is empty"))
		return
	}
	productID, err := primitive.ObjectIDFromHex(productQueryID)
	if err != nil {
		log.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	quantity := 5
	err = ca.CartRepo.AddProductToCart(ctx, productID, userQueryID, quantity)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, err)
	}
	log.Print(ca.CartRepo.AddProductToCart(ctx, productID, userQueryID, quantity))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully added to the cart"})
}
