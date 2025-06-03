package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"context"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type VoucherController struct {
	VoucherRepo reponsitory.VoucherRepo
}

func NewVoucherController(voucherRepo reponsitory.VoucherRepo) *VoucherController {
	return &VoucherController{VoucherRepo: voucherRepo}
}

func (vc *VoucherController) GetAllVouchers(c *gin.Context) {
	vouchers, err := vc.VoucherRepo.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể lấy danh sách voucher"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"vouchers": vouchers})
}

func (vc *VoucherController) GetVoucherByID(c *gin.Context) {
	id := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Print("err", err)
	}
	voucher, err := vc.VoucherRepo.GetByID(ctx, objID)
	if err != nil {
		if err.Error() == "voucher not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy mã giảm giá"})
		} else if err.Error() == "invalid voucher ID" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi server khi tìm voucher"})
		}
		return
	}
	c.JSON(http.StatusOK, voucher)
}

func (vc *VoucherController) CreateVoucher(c *gin.Context) {
	var voucher model.Voucher_MaGiamGia

	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&voucher); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON input: " + err.Error()})
			return
		}
	} else {
		voucher.Code = c.PostForm("code")
		voucher.Value = c.PostForm("value")

		minOrderStr := c.PostForm("min_order_value")
		minOrderVal, err := strconv.Atoi(minOrderStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_order_value: must be a number"})
			return
		}
		voucher.Min_Order_Value = minOrderVal

		expiredStr := c.PostForm("exprired_time")
		expiredTime, err := time.Parse("2006-01-02", expiredStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid exprired_time: must be in YYYY-MM-DD format"})
			return
		}
		voucher.Exprired_Time = expiredTime

		voucher.Description = c.PostForm("description")
		voucher.Status = c.PostForm("status")
	}

	voucher.Voucher_ID = primitive.NewObjectID()
	voucher.Created_At = time.Now()
	voucher.Updated_At = time.Now()

	createdVoucher, err := vc.VoucherRepo.Create(c.Request.Context(), voucher)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create voucher: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"voucher": createdVoucher})
}

func (vc *VoucherController) UpdateVoucher(c *gin.Context) {
	id := c.Param("voucher_id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "voucher_id is required"})
		return
	}
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid voucher_id"})
		return
	}

	var voucher model.Voucher_MaGiamGia
	if c.ContentType() == "application/json" {
		if err := c.ShouldBind(&voucher); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
			return
		}
	} else {
		voucher.Code = c.PostForm("code")
		voucher.Value = c.PostForm("value")

		minOrderStr := c.PostForm("min_order_value")
		minOrderVal, err := strconv.Atoi(minOrderStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_order_value: must be a number"})
			return
		}
		voucher.Min_Order_Value = minOrderVal
		expiredStr := c.PostForm("exprired_time")
		expiredTime, err := time.Parse("2006-01-02", expiredStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid exprired_time: must be in YYYY-MM-DD format"})
			return
		}
		voucher.Exprired_Time = expiredTime
		voucher.Description = c.PostForm("description")
		voucher.Status = c.PostForm("status")
	}

	voucher.Voucher_ID = objectID
	voucher.Updated_At = time.Now()

	updatedVoucher, err := vc.VoucherRepo.Update(c.Request.Context(), voucher)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update voucher: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"voucher": updatedVoucher})
}

func (vc *VoucherController) DeleteVoucher(c *gin.Context) {
	id := c.Param("voucher_id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "voucher_id is required"})
		return
	}
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid voucher_id"})
		return
	}

	err = vc.VoucherRepo.Delete(c.Request.Context(), objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete voucher: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Voucher deleted successfully"})
}
