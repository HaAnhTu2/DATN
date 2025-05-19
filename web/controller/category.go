package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
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

func (ca *CategoryController) CreateCategory(c *gin.Context) {
	category := model.Category_LoaiSanPham{
		Name:   c.Request.FormValue("name"),
		Status: c.Request.FormValue("status"),
	}
	category.Category_ID = primitive.NewObjectID()
	category.Created_At = time.Now()
	category.Updated_At = time.Now()
	category, err := ca.CategoryRepo.Create(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not insert user"})
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
		c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
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
			"error": "Could not update category",
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
			"error": "invalid argument id",
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
		"message": "Category deleted successfully",
	})
}
