package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"net/http"
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

func (vc *VoucherController) CreateVoucher(c *gin.Context) {
	var voucher model.Voucher_MaGiamGia

	if err := c.ShouldBind(&voucher); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
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
	if err := c.ShouldBind(&voucher); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
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
