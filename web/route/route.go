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
	CategoryRepo := reponsitory.NewCategoryRepo(client.Database(os.Getenv("DB_NAME")))
	categoryController := controller.NewCategoryController(CategoryRepo, DB)
	FeedbackRepo := reponsitory.NewFeedbackRepo(client.Database(os.Getenv("DB_NAME")))
	feedbackController := controller.NewFeedbackController(FeedbackRepo, DB)
	ProducerRepo := reponsitory.NewProducerRepo(client.Database(os.Getenv("DB_NAME")))
	producerController := controller.NewProducerController(ProducerRepo)
	VoucherRepo := reponsitory.NewVoucherRepo(client.Database(os.Getenv("DB_NAME")))
	voucherController := controller.NewVoucherController(VoucherRepo)

	// Middleware xác thực
	authMiddleware := middleware.AuthMiddleware

	// Route không cần xác thực
	r.POST("/api/login", userController.Login)
	r.POST("/api/signup", userController.SignUp)
	// r.POST("/api/user/create", userController.CreateUser)
	r.GET("/api/user/get", userController.GetAllUser)
	r.GET("/api/user/get/:id", userController.GetByID)
	r.GET("/api/user/serve-image/:imageId", userController.ServeImage)
	r.GET("/product/get", productController.GetAllProduct)
	r.GET("/product/get/:id", productController.GetByID)
	r.GET("/product/image/:imageId", productController.ServeImageProduct)

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

		// Category routes
		auth.POST("/category/create", categoryController.CreateCategory)
		auth.PUT("/category/update/:category_id", categoryController.UpdateCategory)
		auth.DELETE("/category/delete/:category_id", categoryController.DeleteCategory)

		// Feedback routes
		auth.POST("/feedback/create", feedbackController.CreateFeedback)
		auth.PUT("/feedback/update", feedbackController.UpdateFeedback)
		auth.DELETE("/feedback/delete/:id_user/:id_product", feedbackController.DeleteFeedback)

		// Producer routes
		auth.POST("/producer/create", producerController.CreateProducer)
		auth.PUT("/producer/update/:producer_id", producerController.UpdateProducer)
		auth.DELETE("/producer/delete/:producer_id", producerController.DeleteProducer)

		// Voucher routes
		auth.POST("/voucher/create", voucherController.CreateVoucher)
		auth.PUT("/voucher/update/:voucher_id", voucherController.UpdateVoucher)
		auth.DELETE("/voucher/delete/:voucher_id", voucherController.DeleteVoucher)

		// Cart routes
		auth.GET("/cart/:id", cartController.GetItemFromCart)
		auth.POST("/cart/add/:userID/:id", cartController.AddToCart)
		auth.PUT("/cart/update/:userID/:id", cartController.UpdateCartItem)
		auth.DELETE("/cart/delete/:userID/:id", cartController.RemoveCartItem)

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
