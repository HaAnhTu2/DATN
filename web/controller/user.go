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
			"error": "Invalid credentials",
		})
		return
	}

	if valid, _ := VerifyPassword(auth.Password, user.Password); valid {
		token, err := u.UserRepo.SaveToken(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
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
			"error": "Invalid credentials",
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
		"data": "Logout successful!",
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
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not insert user"})
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
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON body: " + err.Error()})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking email: " + err.Error()})
		return
	}
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with this email already exists"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Successfully Signed Up!!",
		"user":    user,
	})
}

func (u *UserController) GetUserByToken(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required"})
		return
	}
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	email, ok := claims["sub"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email not found in token"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var user model.User_KhachHang
	filter := bson.M{"email": email}
	err = u.DB.Collection("users").FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
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
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	userID := c.Param("id")

	log.Print("user_id: ", userID)
	var user model.User_KhachHang
	if c.ContentType() == "application/json" {
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON: " + err.Error()})
			return
		}
	} else {
		user.Email = c.PostForm("email")
		Password := c.PostForm("password")
		user.Password = HashPassword(Password)
		user.Gender = c.PostForm("gender")
		user.Birthday = c.PostForm("birthday")
		user.Status = c.PostForm("status")
	}

	user.Updated_At = time.Now()

	filter := bson.M{"user_id": userID}
	update := bson.M{
		"$set": bson.M{
			"email":      user.Email,
			"password":   user.Password,
			"birthday":   user.Birthday,
			"gender":     user.Gender,
			"role":       user.Role,
			"status":     user.Status,
			"updated_at": user.Updated_At,
		},
	}

	_, err := u.DB.Collection("users").UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func (u *UserController) DeleteUser(c *gin.Context) {
	userID := c.Param("id")

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	_, err := u.DB.Collection("users").DeleteOne(ctx, bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
