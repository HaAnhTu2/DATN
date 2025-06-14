package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"bytes"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ProductDetailController struct {
	DetailRepo reponsitory.ProductDetailRepo
	DB         *mongo.Database
}

func NewProductDetailController(detailRepo reponsitory.ProductDetailRepo, db *mongo.Database) *ProductDetailController {
	return &ProductDetailController{
		DetailRepo: detailRepo,
		DB:         db,
	}
}
func (ctrl *ProductDetailController) CreateProductDetail(c *gin.Context) {
	detail := model.Product_Detail_ChiTietDonHang{
		Color:  c.PostForm("color"),
		Size:   c.PostForm("size"),
		Status: c.PostForm("status"),
	}

	var err error
	detail.ID_Product = c.Param("id")
	detail.Quantity, err = strconv.Atoi(c.PostForm("quantity"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "số lượng không hợp lệ"})
		return
	}

	detail.Price, err = strconv.Atoi(c.PostForm("price"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Giá không hợp lệ"})
		return
	}

	// Xử lý upload ảnh nếu có
	file, header, err := c.Request.FormFile("image")
	if err == nil && file != nil {
		defer file.Close()
		bucket, err := gridfs.NewBucket(ctrl.DB, options.GridFSBucket().SetName("products"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo thùng GridFS"})
			return
		}

		buf := bytes.NewBuffer(nil)
		io.Copy(buf, file)

		filename := time.Now().Format("20060102150405") + "_" + header.Filename
		uploadStream, err := bucket.OpenUploadStream(filename)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể mở luồng tải lên"})
			return
		}
		defer uploadStream.Close()

		uploadStream.Write(buf.Bytes())

		if oid, ok := uploadStream.FileID.(primitive.ObjectID); ok {
			detail.Image = oid.Hex()
		}
	}

	createdDetail, err := ctrl.DetailRepo.Create(c.Request.Context(), detail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo chi tiết sản phẩm"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product_detail": createdDetail})
}

func (pdc *ProductDetailController) GetDetailByID(c *gin.Context) {
	id := c.Param("id")
	detail, err := pdc.DetailRepo.FindByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chi tiết"})
		return
	}
	c.JSON(http.StatusOK, detail)
}

func (ctrl *ProductDetailController) UpdateProductDetail(c *gin.Context) {
	detailID := c.Param("id")
	if detailID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu ID chi tiết"})
		return
	}

	detail, err := ctrl.DetailRepo.FindByID(c.Request.Context(), detailID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy chi tiết sản phẩm"})
		return
	}

	// Cập nhật các trường nếu có
	if val := c.PostForm("color"); val != "" {
		detail.Color = val
	}
	if val := c.PostForm("size"); val != "" {
		detail.Size = val
	}
	if val := c.PostForm("status"); val != "" {
		detail.Status = val
	}
	if val := c.PostForm("quantity"); val != "" {
		if qty, err := strconv.Atoi(val); err == nil {
			detail.Quantity = qty
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": " số lượng không hợp lệ"})
			return
		}
	}
	if val := c.PostForm("price"); val != "" {
		if price, err := strconv.Atoi(val); err == nil {
			detail.Price = price
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Giá không hợp lệ"})
			return
		}
	}

	// Cập nhật ảnh nếu có
	file, header, err := c.Request.FormFile("image")
	if err == nil && file != nil {
		defer file.Close()
		bucket, err := gridfs.NewBucket(ctrl.DB, options.GridFSBucket().SetName("products"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo thùng GridFS"})
			return
		}
		buf := bytes.NewBuffer(nil)
		io.Copy(buf, file)

		filename := time.Now().Format("20060102150405") + "_" + header.Filename
		uploadStream, err := bucket.OpenUploadStream(filename)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể mở luồng tải lên"})
			return
		}
		defer uploadStream.Close()
		uploadStream.Write(buf.Bytes())

		if oid, ok := uploadStream.FileID.(primitive.ObjectID); ok {
			detail.Image = oid.Hex()
		}
	}

	// Lưu cập nhật
	updatedDetail, err := ctrl.DetailRepo.Update(c.Request.Context(), *detail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật chi tiết sản phẩm"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product_detail": updatedDetail})
}

func (ctrl *ProductDetailController) DeleteProductDetail(c *gin.Context) {
	detailID := c.Param("id")
	if detailID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu ID chi tiết sản phẩm"})
		return
	}

	err := ctrl.DetailRepo.Delete(c.Request.Context(), detailID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không xóa được chi tiết sản phẩm"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Chi tiết sản phẩm đã được xóa thành công"})
}

func (ctrl *ProductDetailController) GetProductDetailsByProductID(c *gin.Context) {
	productID := c.Param("id_product")
	productid := ""
	if productID != "nil" {

		productid = productID
	}
	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thiếu ID sản phẩm"})
		return
	}

	details, err := ctrl.DetailRepo.FindByProductID(c.Request.Context(), productid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy thông tin chi tiết sản phẩm"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"details": details})
}
