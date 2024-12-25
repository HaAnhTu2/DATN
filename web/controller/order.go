package controller

// import (
// 	"net/http"
// 	"strings"
// 	"time"

// 	"DoAnToiNghiep/model"
// 	"DoAnToiNghiep/reponsitory"

// 	"github.com/gin-gonic/gin"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"go.mongodb.org/mongo-driver/mongo"
// )

// type OrderController struct {
// 	OrderRepo reponsitory.OrderRepo
// 	DB        *mongo.Database
// }

// func NewOrderController(orderRepo reponsitory.OrderRepo) *OrderController {
// 	return &OrderController{OrderRepo: orderRepo}
// }

// // GetAllOrders handles the retrieval of all orders.
// func (o *OrderController) GetAllOrders(c *gin.Context) {
// 	orders, err := o.OrderRepo.GetAllOrders(c.Request.Context())
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"orders": orders})
// }

// // GetOrderByID handles retrieval of an order by ID.
// func (o *OrderController) GetOrderByID(c *gin.Context) {
// 	orderID := c.Param("id")
// 	order, err := o.OrderRepo.FindOrderByID(c.Request.Context(), orderID)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"order": order})
// }

// // CreateOrder handles the creation of a new order.
// func (o *OrderController) CreateOrder(c *gin.Context) {
// 	var order model.Order
// 	if err := c.ShouldBindJSON(&order); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order data"})
// 		return
// 	}

// 	order.Order_ID = primitive.NewObjectID()
// 	order.OrderedAt = time.Now()

// 	newOrder, err := o.OrderRepo.CreateOrder(c.Request.Context(), order)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"order": newOrder})
// }

// // UpdateOrder handles the updating of an existing order.
// func (o *OrderController) UpdateOrder(c *gin.Context) {
// 	orderID := c.Param("id")
// 	existingOrder, err := o.OrderRepo.FindOrderByID(c.Request.Context(), orderID)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
// 		return
// 	}

// 	var updates model.Order
// 	if err := c.ShouldBindJSON(&updates); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid update data"})
// 		return
// 	}

// 	// Update fields
// 	if updates.Price != 0 {
// 		existingOrder.Price = updates.Price
// 	}
// 	if updates.Discount != nil {
// 		existingOrder.Discount = updates.Discount
// 	}
// 	if updates.PaymentMethod != (model.Payment{}) {
// 		existingOrder.PaymentMethod = updates.PaymentMethod
// 	}
// 	if len(updates.OrderCart) > 0 {
// 		existingOrder.OrderCart = updates.OrderCart
// 	}

// 	existingOrder.OrderedAt = time.Now()

// 	updatedOrder, err := o.OrderRepo.UpdateOrder(c.Request.Context(), existingOrder)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"order": updatedOrder})
// }

// // DeleteOrder handles deletion of an order by ID.
// func (o *OrderController) DeleteOrder(c *gin.Context) {
// 	orderID := c.Param("id")
// 	if strings.TrimSpace(orderID) == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
// 		return
// 	}

// 	err := o.OrderRepo.DeleteOrder(c.Request.Context(), orderID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete order"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "Order deleted successfully"})
// }

// // FindOrdersByUserID handles retrieval of all orders for a specific user.
// func (o *OrderController) FindOrdersByUserID(c *gin.Context) {
// 	userID := c.Param("user_id")
// 	orders, err := o.OrderRepo.FindOrdersByUserID(c.Request.Context(), userID)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "No orders found for user"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"orders": orders})
// }
