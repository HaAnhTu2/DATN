package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CategoryController struct {
	CategoryRepo reponsitory.CategoryRepo
	DB           *mongo.Database
}

func NewCategoryController(CategoryRepo reponsitory.CategoryRepo, db *mongo.Database) *CategoryController {
	return &CategoryController{CategoryRepo: CategoryRepo,
		DB: db}
}

func (ctrl *CategoryController) GetCategories(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	categories, err := ctrl.CategoryRepo.GetAllCategories(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy được danh mục"})
		return
	}

	c.JSON(http.StatusOK, categories)
}

func (ctrl *CategoryController) GetCategoryByID(c *gin.Context) {
	id := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	category, err := ctrl.CategoryRepo.FindByID(ctx, id)
	if err != nil {
		if err.Error() == "không tìm thấy danh mục" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy loại sản phẩm"})
		} else if err.Error() == "ID danh mục không hợp lệ" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi server khi tìm category"})
		}
		return
	}

	c.JSON(http.StatusOK, category)
}

func (ca *CategoryController) CreateCategory(c *gin.Context) {
	var category model.Category_LoaiSanPham
	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&category); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else {
		category.Name = c.PostForm("name")
		category.Status = c.PostForm("status")
	}

	category.Category_ID = primitive.NewObjectID()
	category.Created_At = time.Now()
	category.Updated_At = time.Now()
	category, err := ca.CategoryRepo.Create(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể chèn người dùng"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"category": category,
	})
}

func (ca *CategoryController) UpdateCategory(c *gin.Context) {
	categoryID := c.Param("category_id")
	category, err := ca.CategoryRepo.FindByID(c.Request.Context(), categoryID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy danh mục"})
		return
	}
	if categoryName := c.PostForm("name"); categoryName != "" {
		category.Name = categoryName
	}
	if categoryStatus := c.PostForm("status"); categoryStatus != "" {
		category.Status = categoryStatus
	}
	category.Updated_At = time.Now()
	updateCategory, err := ca.CategoryRepo.Update(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Không thể cập nhật danh mục",
			"err":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"category": updateCategory,
	})
}

func (ca *CategoryController) DeleteCategory(c *gin.Context) {
	id := c.Param("category_id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "id đối số không hợp lệ",
		})
		return
	}

	if err := ca.CategoryRepo.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Đã xóa danh mục thành công",
	})
}
