package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"context"
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
	return &OrderController{
		OrderRepo: orderRepo,
		DB:        db,
	}
}

func (oc *OrderController) CreateOrder(c *gin.Context) {
	var req struct {
		Order   model.Order_DonHang                 `json:"order"`
		Details []model.Order_Detail_ChiTietDonHang `json:"details"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ", "detail": err.Error()})
		return
	}

	req.Order.OrderDate = time.Now()

	orderResult, err := oc.OrderRepo.CreateOrder(context.Background(), req.Order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo đơn hàng"})
		return
	}

	orderID := orderResult.InsertedID.(string)

	for i := range req.Details {
		req.Details[i].ID_Order = orderID
	}

	_, err = oc.OrderRepo.CreateOrderDetails(context.Background(), req.Details)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo chi tiết đơn hàng"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Tạo đơn hàng thành công", "order_id": orderID})
}

func (oc *OrderController) GetOrdersByUserID(c *gin.Context) {
	userID := c.Param("user_id")
	orders, err := oc.OrderRepo.GetOrdersByUserID(context.Background(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách đơn hàng"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func (oc *OrderController) GetOrderDetails(c *gin.Context) {
	orderID := c.Param("order_id")
	details, err := oc.OrderRepo.GetOrderDetailsByOrderID(context.Background(), orderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy chi tiết đơn hàng"})
		return
	}
	c.JSON(http.StatusOK, details)
}

func (oc *OrderController) CancelOrder(c *gin.Context) {
	orderID := c.Param("order_id")
	err := oc.OrderRepo.CancelOrder(context.Background(), orderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Huỷ đơn hàng thất bại"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Đã huỷ đơn hàng thành công"})
}
