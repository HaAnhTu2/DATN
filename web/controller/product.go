package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ProductController struct {
	ProductRepo       reponsitory.ProductRepo
	ProductDetailRepo reponsitory.ProductDetailRepo
	DB                *mongo.Database
}

func NewProductController(
	repo reponsitory.ProductRepo,
	detailRepo reponsitory.ProductDetailRepo,
	db *mongo.Database,
) *ProductController {
	return &ProductController{
		ProductRepo:       repo,
		ProductDetailRepo: detailRepo,
		DB:                db,
	}
}

func (p *ProductController) GetAllProduct(c *gin.Context) {
	products, err := p.ProductRepo.GetAll(c)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"products": products,
	})
}

func (p *ProductController) GetByID(c *gin.Context) {
	productid := c.Param("id")
	product, err := p.ProductRepo.FindByID(c.Request.Context(), productid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"product": product,
	})
}
func (p *ProductController) CreateProduct(c *gin.Context) {
	// 1. Parse form
	product := model.Product_SanPham{
		ID_Producer: c.PostForm("id_producer"),
		ID_Category: c.PostForm("id_category"),
		Name:        c.PostForm("name"),
		Description: c.PostForm("description"),
		Information: c.PostForm("information"),
		Status:      c.PostForm("status"),
		Created_At:  time.Now(),
		Updated_At:  time.Now(),
	}
	product.Product_ID = primitive.NewObjectID()

	price, err := strconv.Atoi(c.PostForm("price"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price", "field": "price"})
		return
	}
	product.Price = price

	// 2. Save Product
	newProduct, err := p.ProductRepo.Create(c.Request.Context(), product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not insert product"})
		return
	}

	// 3. Upload image
	file, header, err := c.Request.FormFile("image")
	if err != nil || file == nil || header == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image upload failed"})
		return
	}
	defer file.Close()

	bucket, err := gridfs.NewBucket(p.DB, options.GridFSBucket().SetName("products"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create GridFS bucket"})
		return
	}

	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read image"})
		return
	}

	filename := time.Now().Format("20060102150405") + "_" + header.Filename
	uploadStream, err := bucket.OpenUploadStream(filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open GridFS upload stream"})
		return
	}
	defer uploadStream.Close()

	if _, err := uploadStream.Write(buf.Bytes()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write to GridFS"})
		return
	}

	imageID := ""
	if oid, ok := uploadStream.FileID.(primitive.ObjectID); ok {
		imageID = oid.Hex()
	}

	// 4. Save product detail
	detail := model.Product_Detail_ChiTietDonHang{
		ID_Product: newProduct.Product_ID.Hex(),
		Color:      c.PostForm("color"),
		Size:       c.PostForm("size"),
		Status:     c.PostForm("status_detail"),
		Image:      imageID,
	}

	detail.Quantity, err = strconv.Atoi(c.PostForm("quantity"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid quantity"})
		return
	}
	detail.Price, err = strconv.Atoi(c.PostForm("price_detail"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid detail price"})
		return
	}

	createdDetail, err := p.ProductDetailRepo.Create(c.Request.Context(), detail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not insert product detail"})
		return
	}

	// 5. Response
	c.JSON(http.StatusOK, gin.H{
		"product":        newProduct,
		"product_detail": createdDetail,
	})
}

func (p *ProductController) ServeImageProduct(c *gin.Context) {
	imageId := strings.TrimPrefix(c.Request.URL.Path, "/image2/")
	objID, err := primitive.ObjectIDFromHex(imageId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	bucket, _ := gridfs.NewBucket(p.DB.Client().Database(os.Getenv("DB_NAME")), options.GridFSBucket().SetName("products"))

	var buf bytes.Buffer
	_, err = bucket.DownloadToStream(objID, &buf)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not download image"})
		return
	}

	contentType := http.DetectContentType(buf.Bytes())
	c.Writer.Header().Add("Content-Type", contentType)
	c.Writer.Header().Add("Content-Length", strconv.Itoa(len(buf.Bytes())))
	c.Writer.Write(buf.Bytes())
}

func (p *ProductController) UpdateProduct(c *gin.Context) {
	productID := c.Param("id")

	// 1. Tìm sản phẩm
	product, err := p.ProductRepo.FindByID(c.Request.Context(), productID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// 2. Cập nhật các trường nếu có
	if val := c.PostForm("id_producer"); val != "" {
		product.ID_Producer = val
	}
	if val := c.PostForm("id_category"); val != "" {
		product.ID_Category = val
	}
	if val := c.PostForm("name"); val != "" {
		product.Name = val
	}
	if val := c.PostForm("description"); val != "" {
		product.Description = val
	}
	if val := c.PostForm("information"); val != "" {
		product.Information = val
	}
	if val := c.PostForm("status"); val != "" {
		product.Status = val
	}
	if val := c.PostForm("price"); val != "" {
		if price, err := strconv.Atoi(val); err == nil {
			product.Price = price
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price"})
			return
		}
	}
	product.Updated_At = time.Now()

	// 3. Cập nhật ảnh nếu có
	file, header, err := c.Request.FormFile("image")
	if err == nil {
		defer file.Close()
		bucket, err := gridfs.NewBucket(p.DB, options.GridFSBucket().SetName("products"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create GridFS bucket"})
			return
		}
		buf := bytes.NewBuffer(nil)
		io.Copy(buf, file)
		filename := time.Now().Format(time.RFC3339) + "_" + header.Filename

		uploadStream, err := bucket.OpenUploadStream(filename)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open upload stream"})
			return
		}
		defer uploadStream.Close()
		uploadStream.Write(buf.Bytes())

		fileId, _ := json.Marshal(uploadStream.FileID)
		imageID := strings.Trim(string(fileId), `"`)
		// Nếu muốn lưu ảnh vào chi tiết, bạn cần tìm chi tiết sản phẩm rồi cập nhật
		detail, err := p.ProductDetailRepo.FindByProductID(c.Request.Context(), productID)
		if err == nil {
			detail.Image = imageID
			_, err = p.ProductDetailRepo.Update(c.Request.Context(), detail)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update product"})
				return
			}
		}
	}

	// 4. Cập nhật sản phẩm
	updatedProduct, err := p.ProductRepo.Update(c.Request.Context(), product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product": updatedProduct})
}

func (p *ProductController) DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid argument id",
		})
		return
	}
	if err := p.ProductRepo.Delete(c, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
	}
}
