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
	"gopkg.in/mgo.v2/bson"
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

func (ca *CartController) GetItemFromCart(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	// Chuyển đổi userID sang ObjectID
	userOID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid ObjectID format"})
		return
	}

	// Tạo context với timeout
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Tìm giỏ hàng dựa trên userID
	var cart model.Cart
	err = ca.DB.Collection("carts").FindOne(ctx, bson.M{"_id": userOID}).Decode(&cart)
	if err != nil {
		log.Println("Error finding cart:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cart not found"})
		return
	}

	// Tính tổng giá trị giỏ hàng
	var total float64
	for _, item := range cart.LineItems {
		total += item.Subtotal
	}

	// Trả về kết quả
	c.JSON(http.StatusOK, gin.H{
		"total":     total,
		"lineItems": cart.LineItems,
	})
}

func (ca *CartController) UpdateCartItem(c *gin.Context) {
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

	if cartquantity <= 0 {
		log.Println("Invalid quantity:", cartquantity)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity must be greater than zero"})
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
	err = ca.CartRepo.UpdateCartItem(ctx, productID, userQueryID, cartquantity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully updated the cart item"})
}

func (ca *CartController) RemoveCartItem(c *gin.Context) {
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

	productID, err := primitive.ObjectIDFromHex(productQueryID)
	if err != nil {
		log.Println(err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	err = ca.CartRepo.RemoveCartItem(ctx, productID, userQueryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully removed the cart item"})
}
