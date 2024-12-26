package route

import (
	"DoAnToiNghiep/controller"
	"DoAnToiNghiep/db"
	"DoAnToiNghiep/middleware"
	"DoAnToiNghiep/reponsitory"
	"os"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func Route(r *gin.Engine, DB *mongo.Database) {
	// Kết nối DB
	client := db.ConnectDB()
	ProductRepo := reponsitory.NewProductRepo(client.Database(os.Getenv("DB_NAME")))
	productController := controller.NewProductController(ProductRepo, DB)
	UserRepo := reponsitory.NewUserRepo(client.Database(os.Getenv("DB_NAME")))
	userController := controller.NewUserController(UserRepo, DB)
	CartRepo := reponsitory.NewCartRepo(client.Database(os.Getenv("DB_NAME")))
	cartController := controller.NewCartController(CartRepo, DB)
	OrderRepo := reponsitory.NewOrderRepo(client.Database(os.Getenv("DB_NAME")))
	orderController := controller.NewOrderController(OrderRepo, DB)

	// Middleware xác thực
	authMiddleware := middleware.AuthMiddleware

	// Route không cần xác thực
	r.POST("/api/login", userController.Login)
	r.POST("/api/signup", userController.SignUp)
	// r.POST("/api/user/create", userController.CreateUser)
	r.GET("/api/user/get", userController.GetAllUser)
	r.GET("/api/user/get/:id", userController.GetByID)
	r.GET("/api/user/serve-image/:imageId", userController.ServeImage)

	// Nhóm route có xác thực
	auth := r.Group("/api")
	auth.Use(authMiddleware)
	{
		// User routes
		auth.GET("/users", userController.GetUserByToken)
		auth.PUT("/user/update/:id", userController.UpdateUser)
		auth.DELETE("/user/delete/:id", userController.DeleteUser)

		// Product routes
		auth.POST("/product/create", productController.CreateProduct)
		auth.PUT("/product/update/:id", productController.UpdateProduct)
		auth.DELETE("/product/delete/:id", productController.DeleteProduct)
		auth.GET("/product/get", productController.GetAllProduct)
		auth.GET("/product/get/:id", productController.GetByID)
		auth.GET("/product/image/:imageId", productController.ServeImageProduct)

		// Cart routes
		auth.GET("/cart/:id", cartController.GetItemFromCart)
		auth.POST("/cart/add/:userID/:id", cartController.AddToCart)
		auth.PUT("/cart/update/:userID/:id", cartController.UpdateCartItem)
		auth.DELETE("/cart/remove/:userID/:id", cartController.RemoveCartItem)

		// Order routes
		auth.POST("/order/checkout/:userID", orderController.CreateOrderFromCart)

		// Logout route
		auth.DELETE("/logout", userController.Logout)
	}

	// Lấy ảnh từ đường dẫn
	r.GET("/image/:id", userController.ServeImage)
	r.GET("/image2/:id", productController.ServeImageProduct)
	r.GET("/product/get", productController.GetAllProduct)
	r.GET("/product/get/:id", productController.GetByID)
	r.GET("/product/image/:id", productController.ServeImageProduct)
}
