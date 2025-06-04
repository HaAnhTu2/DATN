package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type CartController struct {
	CartRepo reponsitory.CartRepo
	DB       *mongo.Database
}

func NewCartController(cartRepo reponsitory.CartRepo, db *mongo.Database) *CartController {
	return &CartController{
		CartRepo: cartRepo,
		DB:       db,
	}
}

func (cc *CartController) AddToCart(c *gin.Context) {
	var cart model.Cart_GioHang
	if err := c.ShouldBindJSON(&cart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	err := cc.CartRepo.Create(context.Background(), cart)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể thêm vào giỏ hàng"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Thêm vào giỏ hàng thành công"})
}

func (cc *CartController) GetCartByUserID(c *gin.Context) {
	userID := c.Param("user_id")
	carts, err := cc.CartRepo.GetByUserID(context.Background(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy giỏ hàng"})
		return
	}
	c.JSON(http.StatusOK, carts)
}

func (cc *CartController) UpdateQuantity(c *gin.Context) {
	var body struct {
		UserID   string `json:"id_user"`
		DetailID string `json:"id_product_detail"`
		Quantity int    `json:"quantity"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	err := cc.CartRepo.UpdateQuantity(context.Background(), body.UserID, body.DetailID, body.Quantity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật số lượng"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cập nhật thành công"})
}

func (cc *CartController) DeleteCartItem(c *gin.Context) {
	userID := c.Param("user_id")
	detailID := c.Param("product_detail_id")
	log.Print(userID, detailID)
	err := cc.CartRepo.Delete(context.Background(), userID, detailID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xoá sản phẩm"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Xoá sản phẩm thành công"})
}

func (cc *CartController) ClearCart(c *gin.Context) {
	userID := c.Param("user_id")

	err := cc.CartRepo.ClearCart(context.Background(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xoá giỏ hàng"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đã xoá toàn bộ giỏ hàng"})
}
