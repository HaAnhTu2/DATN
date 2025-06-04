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
func (vc *VoucherController) ApplyVoucher(c *gin.Context) {
	var request struct {
		UserID string `json:"user_id"`
		Code   string `json:"code"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ"})
		return
	}

	voucher, err := vc.VoucherRepo.FindValidVoucher(c.Request.Context(), request.Code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"voucher": voucher,
	})
}

func (vc *VoucherController) CreateVoucher(c *gin.Context) {
	var voucher model.Voucher_MaGiamGia

	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&voucher); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Đầu vào JSON không hợp lệ: " + err.Error()})
			return
		}
	} else {
		voucher.Code = c.PostForm("code")
		valueStr := c.PostForm("value")
		value, err := strconv.Atoi(valueStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Giá trị không hợp lệ: phải là một số"})
			return
		}
		voucher.Value = value

		minOrderStr := c.PostForm("min_order_value")
		minOrderVal, err := strconv.Atoi(minOrderStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "min_order_value không hợp lệ: phải là một số"})
			return
		}
		voucher.Min_Order_Value = minOrderVal

		expiredStr := c.PostForm("exprired_time")
		expiredTime, err := time.Parse("2006-01-02", expiredStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Exprired_time không hợp lệ: phải theo định dạng YYYY-MM-DD"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể tạo chứng từ: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"voucher": createdVoucher})
}

func (vc *VoucherController) UpdateVoucher(c *gin.Context) {
	id := c.Param("voucher_id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "voucher_id là bắt buộc"})
		return
	}
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "voucher_id không hợp lệ"})
		return
	}

	var voucher model.Voucher_MaGiamGia
	if c.ContentType() == "application/json" {
		if err := c.ShouldBind(&voucher); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Đầu vào không hợp lệ: " + err.Error()})
			return
		}
	} else {
		voucher.Code = c.PostForm("code")
		valueStr := c.PostForm("value")
		value, err := strconv.Atoi(valueStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Giá trị không hợp lệ: phải là một số"})
			return
		}
		voucher.Value = value

		minOrderStr := c.PostForm("min_order_value")
		minOrderVal, err := strconv.Atoi(minOrderStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "min_order_value không hợp lệ: phải là một số"})
			return
		}
		voucher.Min_Order_Value = minOrderVal
		expiredStr := c.PostForm("exprired_time")
		expiredTime, err := time.Parse("2006-01-02", expiredStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Exprired_time không hợp lệ: phải theo định dạng YYYY-MM-DD"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể cập nhật chứng từ: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"voucher": updatedVoucher})
}

func (vc *VoucherController) DeleteVoucher(c *gin.Context) {
	id := c.Param("voucher_id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "voucher_id là bắt buộc"})
		return
	}
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chứng từ_id không hợp lệ"})
		return
	}

	err = vc.VoucherRepo.Delete(c.Request.Context(), objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể xóa chứng từ: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Đã xóa thành công chứng từ"})
}
