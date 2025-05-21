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
	client := db.ConnectDB()

	// Khởi tạo các repo + controller
	ProductDetailRepo := reponsitory.NewProductDetailRepo(client.Database(os.Getenv("DB_NAME")))
	productDetailController := controller.NewProductDetailController(ProductDetailRepo, DB)

	ProductRepo := reponsitory.NewProductRepo(client.Database(os.Getenv("DB_NAME")))
	productController := controller.NewProductController(ProductRepo, ProductDetailRepo, DB)

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

	// Các route public (không cần xác thực)
	r.POST("/api/login", userController.Login)
	r.POST("/api/signup", userController.SignUp)
	r.GET("/api/user/get", userController.GetAllUser)

	// Lấy ảnh từ đường dẫn
	r.GET("/image/:id", productController.ServeImageProduct)
	r.GET("/api/feedback/image/:id", feedbackController.ServeImageFeedback)
	r.GET("/api/product/get", productController.GetAllProduct)
	r.GET("/api/product/get/:id", productController.GetByID)
	r.GET("/api/product/image/:id", productController.ServeImageProduct)

	// ProductDetail public routes (nếu cần)
	r.GET("/api/productdetail/product/:id_product", productDetailController.GetProductDetailsByProductID)
	r.GET("/api/productdetail/get/:id", productDetailController.GetDetailByID)

	r.GET("/api/category", categoryController.GetCategories)
	r.GET("/api/producer", producerController.GetAllProducer)
	r.GET("/api/feedback", feedbackController.GetAllFeedback)

	// Nhóm route cần xác thực
	auth := r.Group("/api")
	auth.Use(authMiddleware)
	{
		// User routes
		auth.GET("/users", userController.GetUserByToken)
		auth.GET("/user/get/:id", userController.GetByID)
		auth.PUT("/user/update/:id", userController.UpdateUser)
		auth.DELETE("/user/delete/:id", userController.DeleteUser)

		// Product routes
		auth.POST("/product/create", productController.CreateProduct)
		auth.PUT("/product/update/:id", productController.UpdateProduct)
		auth.DELETE("/product/delete/:id", productController.DeleteProduct)

		// ProductDetail routes
		auth.POST("/product-detail", productDetailController.CreateProductDetail)
		auth.PUT("/product-detail/:id", productDetailController.UpdateProductDetail)
		auth.DELETE("/product-detail/delete/:id", productDetailController.DeleteProductDetail)

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
		auth.POST("/cart", cartController.AddToCart)
		auth.GET("/cart/:user_id", cartController.GetCartByUserID)
		auth.PUT("/cart/quantity", cartController.UpdateQuantity)
		auth.DELETE("/cart", cartController.DeleteCartItem)
		auth.DELETE("/cart/clear/:user_id", cartController.ClearCart)

		// Order routes
		auth.POST("/order", orderController.CreateOrder)
		auth.POST("/order/create", orderController.CreateOrder)
		auth.GET("/order/user/:user_id", orderController.GetOrdersByUserID)
		auth.GET("/order/detail/:order_id", orderController.GetOrderDetails)
		auth.PUT("/order/cancel/:order_id", orderController.CancelOrder)

		// auth.POST("/order/checkout/:userID", orderController.CreateOrderFromCart)

		// Logout route
		auth.DELETE("/logout", userController.Logout)
	}

}
