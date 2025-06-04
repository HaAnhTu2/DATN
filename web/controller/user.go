package controller

import (
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2/bson"
)

type UserController struct {
	UserRepo reponsitory.UserRepo
	DB       *mongo.Database
}

func NewUserController(UserRepo reponsitory.UserRepo, db *mongo.Database) *UserController {
	return &UserController{UserRepo: UserRepo,
		DB: db}
}

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}
	return string(bytes)
}

func VerifyPassword(userpassword string, givenpassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(givenpassword), []byte(userpassword))
	valid := true
	msg := ""
	if err != nil {
		msg = "Login Or Password is Incorrect"
		valid = false
	}
	return valid, msg
}

var Validate = validator.New()

func (u *UserController) Login(c *gin.Context) {
	var auth model.LoginRequest
	if err := c.ShouldBind(&auth); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	user, err := u.UserRepo.FindByEmail(c.Request.Context(), auth.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Thông tin xác thực không hợp lệ",
		})
		return
	}

	if valid, _ := VerifyPassword(auth.Password, user.Password); valid {
		token, err := u.UserRepo.SaveToken(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không tạo được mã thông báo"})
			return
		}
		cookie := http.Cookie{
			Name:    "Token",
			Value:   token,
			Expires: time.Now().Add(15 * time.Hour),
		}
		http.SetCookie(c.Writer, &cookie)
		c.JSON(http.StatusOK, gin.H{
			"token": token,
			"user":  user,
		})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Thông tin xác thực không hợp lệ",
		})
	}
}

func (u *UserController) Logout(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:   "Token",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})
	c.JSON(http.StatusOK, gin.H{
		"data": "Đăng xuất thành công!",
	})
}

func (u *UserController) GetAllUser(c *gin.Context) {
	users, err := u.UserRepo.GetAll(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func (u *UserController) GetByID(c *gin.Context) {
	userId := c.Param("id")
	user, err := u.UserRepo.FindByID(c.Request.Context(), userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy người dùng"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// --- Thay đổi từ model.User sang model.User_KhachHang ở các hàm liên quan tới user ---

func (u *UserController) CreateUser(c *gin.Context) {
	user := model.User_KhachHang{
		Email:    c.Request.FormValue("email"),
		Password: c.Request.FormValue("password"),
		Birthday: c.Request.FormValue("birthday"),
		Gender:   c.Request.FormValue("gender"),
		Role:     c.Request.FormValue("role"),
		Status:   c.Request.FormValue("status"),
	}

	if user.Role == "" {
		user.Role = "User"
	}

	user.Created_At = time.Now()
	user.Updated_At = time.Now()

	_, err := u.DB.Collection("users").InsertOne(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể chèn người dùng"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"fileId": user.User_ID,
		"user":   user,
	})
}

func (u *UserController) SignUp(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var user model.User_KhachHang
	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "JSON không hợp lệ: " + err.Error()})
			return
		}
	} else {
		user.Email = c.PostForm("email")
		user.Password = c.PostForm("password")
		user.Birthday = c.PostForm("birthday")
		user.Gender = c.PostForm("gender")
		user.Role = c.PostForm("role")
		user.Status = c.PostForm("status")
	}

	validationErr := Validate.Struct(user)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		return
	}

	count, err := u.DB.Collection("users").CountDocuments(ctx, bson.M{"email": user.Email})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi kiểm tra email: " + err.Error()})
		return
	}
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Người dùng có email này đã tồn tại"})
		return
	}

	password := HashPassword(user.Password)
	user.Password = password
	user.User_ID = primitive.NewObjectID().Hex()

	if user.Role == "" {
		user.Role = "User"
	}

	_, err = u.UserRepo.Create(ctx, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không tạo được người dùng: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Đã đăng ký thành công!!",
		"user":    user,
	})
}

func (u *UserController) GetUserByToken(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Mã thông báo ủy quyền là bắt buộc"})
		return
	}
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Mã thông báo không hợp lệ hoặc đã hết hạn"})
		return
	}

	email, ok := claims["sub"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Không tìm thấy email trong mã thông báo"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var user model.User_KhachHang
	filter := bson.M{"email": email}
	err = u.DB.Collection("users").FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy người dùng"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Đã xảy ra lỗi"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"user_id":  user.User_ID,
			"email":    user.Email,
			"role":     user.Role,
			"birthday": user.Birthday,
			"gender":   user.Gender,
			"status":   user.Status,
		},
	})
}

func (u *UserController) UpdateUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	userID := c.Param("id")

	var user model.User_KhachHang
	updateFields := bson.M{}

	// Xử lý JSON
	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "JSON không hợp lệ: " + err.Error()})
			return
		}
		// Gộp dữ liệu vào updateFields nếu có
		if user.Email != "" {
			updateFields["email"] = user.Email
		}
		if user.Password != "" {
			updateFields["password"] = HashPassword(user.Password)
		}
		if user.Birthday != "" {
			updateFields["birthday"] = user.Birthday
		}
		if user.Gender != "" {
			updateFields["gender"] = user.Gender
		}
		if user.Role != "" {
			updateFields["role"] = user.Role
		}
		if user.Status != "" {
			updateFields["status"] = user.Status
		}
	} else {
		email := c.PostForm("email")
		password := c.PostForm("password")
		birthday := c.PostForm("birthday")
		gender := c.PostForm("gender")
		role := c.PostForm("role")
		status := c.PostForm("status")

		if email != "" {
			updateFields["email"] = email
		}
		if password != "" {
			updateFields["password"] = HashPassword(password)
		}
		if birthday != "" {
			updateFields["birthday"] = birthday
		}
		if gender != "" {
			updateFields["gender"] = gender
		}
		if role != "" {
			updateFields["role"] = role
		}
		if status != "" {
			updateFields["status"] = status
		}
	}

	updateFields["updated_at"] = time.Now()

	if len(updateFields) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Không có trường nào được cập nhật"})
		return
	}

	filter := bson.M{"user_id": userID}
	update := bson.M{"$set": updateFields}

	_, err := u.DB.Collection("users").UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cập nhật không thành công: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cập nhật không thành công"})
}

func (u *UserController) DeleteUser(c *gin.Context) {
	userID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	_, err := u.DB.Collection("users").DeleteOne(ctx, bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Không xóa được người dùng: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Người dùng đã xóa thành công"})
}
