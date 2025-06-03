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
	"go.mongodb.org/mongo-driver/mongo"
)

type OrderController struct {
	OrderRepo reponsitory.OrderRepo
	CartRepo  reponsitory.CartRepo
	DB        *mongo.Database
}

func NewOrderController(orderRepo reponsitory.OrderRepo, cartRepo reponsitory.CartRepo, db *mongo.Database) *OrderController {
	return &OrderController{
		OrderRepo: orderRepo,
		CartRepo:  cartRepo,
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
	log.Print("req.Order.ID_User: ", req.Order.ID_User)

	req.Order.OrderDate = time.Now()
	req.Order.Order_ID = primitive.NewObjectID()

	orderResult, err := oc.OrderRepo.CreateOrder(context.Background(), req.Order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo đơn hàng"})
		return
	} else {
		err := oc.CartRepo.ClearCart(context.Background(), req.Order.ID_User)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xoá giỏ hàng"})
		}
	}

	orderIDObj, ok := orderResult.InsertedID.(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ID đơn hàng không hợp lệ"})
		return
	}
	orderID := orderIDObj.Hex()

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
		log.Print("error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Huỷ đơn hàng thất bại"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Đã huỷ đơn hàng thành công"})
}

// Lấy tất cả đơn hàng (admin)
func (oc *OrderController) GetAllOrders(c *gin.Context) {
	orders, err := oc.OrderRepo.GetAllOrders(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách tất cả đơn hàng"})
		return
	}
	c.JSON(http.StatusOK, orders)
}

// Cập nhật trạng thái đơn hàng
func (oc *OrderController) UpdateOrderStatus(c *gin.Context) {
	orderID := c.Param("order_id")
	var body struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || body.Status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Trạng thái không hợp lệ"})
		return
	}

	err := oc.OrderRepo.UpdateOrderStatus(context.Background(), orderID, body.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật trạng thái đơn hàng"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Cập nhật trạng thái đơn hàng thành công"})
}

// Xoá đơn hàng
func (oc *OrderController) DeleteOrder(c *gin.Context) {
	orderID := c.Param("order_id")
	err := oc.OrderRepo.DeleteOrder(context.Background(), orderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xoá đơn hàng"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Đơn hàng đã được xoá thành công"})
}
