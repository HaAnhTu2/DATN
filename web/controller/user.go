package controller

import (
	// "DoAnToiNghiep/controller"
	"DoAnToiNghiep/model"
	"DoAnToiNghiep/reponsitory"
	generate "DoAnToiNghiep/tokens"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
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
		msg = "Login Or Passowrd is Incorerct"
		valid = false
	}
	return valid, msg
}

var Validate = validator.New()

//	func (u *UserController) Login(c *gin.Context) {
//		var auth model.LoginRequest
//		if err := c.ShouldBind(&auth); err != nil {
//			c.JSON(http.StatusBadRequest, gin.H{
//				"error": err.Error(),
//			})
//			return
//		}
//		user, err := u.UserRepo.FindByEmail(c.Request.Context(), auth.Email)
//		if err != nil {
//			c.JSON(http.StatusUnauthorized, gin.H{
//				"error": "Invalid credentials",
//			})
//			return
//		}
//		if auth.Email == user.Email && auth.Password == user.Password {
//			token, err := u.UserRepo.SaveToken(&user)
//			log.Print(token)
//			if err != nil {
//				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
//				return
//			}
//			cookie := http.Cookie{}
//			cookie.Name = "Token"
//			cookie.Value = token
//			cookie.Expires = time.Now().Add(15 * time.Hour)
//			http.SetCookie(c.Writer, &cookie)
//			c.JSON(http.StatusOK, gin.H{
//				"token": token,
//				"user":  user,
//			})
//			log.Print(token)
//		} else {
//			c.JSON(http.StatusUnauthorized, gin.H{
//				"error": "Invalid credentials",
//			})
//		}
//	}
func (u *UserController) Login(c *gin.Context) {
	var auth model.LoginRequest
	if err := c.ShouldBind(&auth); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	// Tìm người dùng theo email
	user, err := u.UserRepo.FindByEmail(c.Request.Context(), auth.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid credentials",
		})
		return
	}

	// Kiểm tra mật khẩu
	if valid, _ := VerifyPassword(auth.Password, user.Password); valid {
		// Nếu mật khẩu hợp lệ, tạo token và trả về
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
		MaxAge: -1, // Delete the Cookie
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

func (u *UserController) CreateUser(c *gin.Context) {
	user := model.User{
		First_Name:  c.Request.FormValue("firstname"),
		Last_Name:   c.Request.FormValue("lastname"),
		Email:       c.Request.FormValue("email"),
		Password:    c.Request.FormValue("password"),
		Address:     c.Request.FormValue("address"),
		PhoneNumber: c.Request.FormValue("phone_number"),
		Role:        c.Request.FormValue("role"),
	}

	file, header, err := c.Request.FormFile("image")
	log.Print(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image upload failed"})
		return
	}
	defer file.Close()

	//Create GridFS bucket
	bucket, err := gridfs.NewBucket(u.DB.Client().Database("DoAnToiNghiep"), options.GridFSBucket().SetName("photos_user"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not create GridFS bucket"})
		return
	}
	//Read image
	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not read image"})
		return
	}
	//Open upload stream
	filename := time.Now().Format(time.RFC3339) + "_" + header.Filename
	uploadStream, err := bucket.OpenUploadStream(filename)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not open upload stream"})
		return
	}
	defer uploadStream.Close()
	//Write to upload stream
	fileSize, err := uploadStream.Write(buf.Bytes())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not write to upload stream"})
		return
	}
	// Save the file ID to the user model
	fileId, err := json.Marshal(uploadStream.FileID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not marshal file ID"})
		return
	}
	user.UserImage_URL = strings.Trim(string(fileId), `"`)
	if c.Request.FormValue("role") == "Admin" {
		if user.Role != "admin" {
			c.JSON(http.StatusOK, gin.H{"error": "you is not admin"})
			return
		}
	}
	// Insert the user into the database
	users, err := u.UserRepo.Create(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not insert user"})
		return
	}
	user.Created_At = time.Now()
	user.Updated_At = time.Now()
	c.JSON(http.StatusOK, gin.H{
		"fileId":   user.UserImage_URL,
		"fileSize": fileSize,
		"user":     users,
	})
}

func (u *UserController) SignUp(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	var user = model.User{
		First_Name:  c.Request.FormValue("firstname"),
		Last_Name:   c.Request.FormValue("lastname"),
		Email:       c.Request.FormValue("email"),
		Password:    c.Request.FormValue("password"),
		Address:     c.Request.FormValue("address"),
		PhoneNumber: c.Request.FormValue("phone_number"),
		Role:        c.Request.FormValue("role"),
	}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
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
	count, err = u.DB.Collection("users").CountDocuments(ctx, bson.M{"phone_number": user.PhoneNumber})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking phone: " + err.Error()})
		return
	}
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Phone number is already in use"})
		return
	}
	password := HashPassword(user.Password)
	user.Password = password
	user.Created_At = time.Now()
	user.Updated_At = time.Now()
	user.ID = primitive.NewObjectID()
	user.User_ID = user.ID.Hex()
	token, refreshtoken, err := generate.TokenGenerator(user.Email, user.First_Name, user.Last_Name, user.User_ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating tokens"})
		return
	}
	user.Token = token
	user.Refresh_Token = refreshtoken
	if user.Role == "" {
		defaultRole := "User"
		user.Role = defaultRole
	}
	_, inserterr := u.DB.Collection("users").InsertOne(ctx, user)
	if inserterr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user: " + inserterr.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "Successfully Signed Up!!",
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"first_name": user.First_Name,
			"last_name":  user.Last_Name,
			"role":       user.Role,
		},
	})
}
func (u *UserController) GetUserByToken(c *gin.Context) {
	// Lấy token từ header Authorization
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required"})
		return
	}

	// Loại bỏ tiền tố "Bearer "
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// Khai báo struct claims để lưu thông tin giải mã từ token
	claims := &model.SignedDetails{}

	// Xác minh token và parse claims
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Trả về secret key để xác minh token
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	// Kiểm tra lỗi hoặc tính hợp lệ của token
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	// Lấy email từ claims
	userEmail := claims.Email
	fmt.Println("User email from token:", userEmail)

	// Tạo context với timeout
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var user model.User

	// Tạo bộ lọc tìm kiếm người dùng theo email
	filter := bson.M{"email": userEmail}

	// Tìm người dùng trong cơ sở dữ liệu
	err = u.DB.Collection("users").FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		}
		return
	}

	// Trả về thông tin người dùng
	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":         user.ID,
			"first_name": user.First_Name,
			"last_name":  user.Last_Name,
			"email":      user.Email,
		},
	})
}

func (u *UserController) ServeImage(c *gin.Context) {
	imageId := strings.TrimPrefix(c.Request.URL.Path, "/image/")
	objID, err := primitive.ObjectIDFromHex(imageId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image ID"})
		return
	}

	bucket, _ := gridfs.NewBucket(u.DB.Client().Database("DoAnToiNghiep"), options.GridFSBucket().SetName("photos_user"))

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

func (u *UserController) UpdateUser(c *gin.Context) {
	userId := c.Param("id")
	user, err := u.UserRepo.FindByID(c.Request.Context(), userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	// if name := c.PostForm("name"); name != "" {
	// 	user.Name = name
	// }
	if firstname := c.PostForm("firstname"); firstname != "" {
		user.First_Name = firstname
	}
	if lastname := c.PostForm("lastname"); lastname != "" {
		user.Last_Name = lastname
	}
	if email := c.PostForm("email"); email != "" {
		user.Email = email
	}
	if password := c.PostForm("password"); password != "" {
		user.Password = password
	}
	if address := c.PostForm("address"); address != "" {
		user.Address = address
	}
	if phone_number := c.PostForm("phone_number"); phone_number != "" {
		user.PhoneNumber = phone_number
	}
	if role := c.PostForm("role"); role != "" {
		user.Role = role
	}
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	}
	defer file.Close()
	bucket, err := gridfs.NewBucket(u.DB.Client().Database("DoAnToiNghiep"), options.GridFSBucket().SetName("photos_user"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not create GridFS bucket"})
		return
	}

	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not read image"})
		return
	}

	filename := time.Now().Format(time.RFC3339) + "_" + header.Filename
	uploadStream, err := bucket.OpenUploadStream(filename)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not open upload stream"})
		return
	}
	defer uploadStream.Close()

	if _, err := uploadStream.Write(buf.Bytes()); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not write to upload stream"})
		return
	}
	fileId, err := json.Marshal(uploadStream.FileID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not marshal file ID"})
		return
	}
	log.Print(fileId)
	user.UserImage_URL = strings.Trim(string(fileId), `"`)
	user.Updated_At = time.Now()
	updatedUser, err := u.UserRepo.Update(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not update user",
			"err":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": updatedUser,
	})
}

func (u *UserController) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid argument id"})
		return
	}
	if err := u.UserRepo.Delete(c, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}
