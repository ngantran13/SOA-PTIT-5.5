# 🧩 Hệ thống đặt vé xem phim

Hệ thống đặt vé xem phim cho phép khách hàng chọn phim, suất chiếu, ghế ngồi và tiến hành đặt vé trực tuyến. Sau khi khách hàng chọn phim, hệ thống sẽ kiểm tra tình trạng chỗ ngồi, xác minh thông tin vé, và xử lý thanh toán. Nếu đặt vé thành công, hệ thống sẽ gửi thông báo xác nhận vé đã đặt đến email của khách hàng.
---

## 📁 Cấu trúc thư mục

```
microservices-assignment-starter/
├── README.md                       # This instruction file
├── .env.example                    # Example environment variables
├── docker-compose.yml              # Multi-container setup for all services
├── docs/                           # Documentation folder
│   ├── architecture.md             # Describe your system design here
│   ├── analysis-and-design.md      # Document system analysis and design details
│   ├── asset/                      # Store images, diagrams, or other visual assets for documentation
│   └── api-specs/                  # API specifications in OpenAPI (YAML)
│       ├── booking_ticket_service.yaml
│       └── customer_service.yaml
│       └── movie_service.yaml
│       └── notification_service.yaml
│       └── payment_service.yaml
│       └── seat_service.yaml
├── scripts/                        # Utility or deployment scripts
│   └── init.sh
├── services/                       # Application microservices
│   ├── booking-ticket-service/     # Quản lý hóa đơn đặt vé xem phim của khách hàng
│   │   ├── Dockerfile
│   │   └── app/
│   │   └── .env
│   │   └── requirements.txt
│   │   └── readme.md               
│   ├── customer-service/           # Quản lý thông tin khách hàng và xác minh đăng nhập
│   │   ├── Dockerfile
│   │   └── app/
│   │   └── .env
│   │   └── requirements.txt
│   │   └── readme.md      
│   ├── movie-service/              # Quản lý thông tin về phim và suất chiếu của phim
│   │   ├── Dockerfile
│   │   └── app/
│   │   └── .env
│   │   └── requirements.txt
│   │   └── readme.md     
│   ├── notification-service/       # Gửi email thông báo đến khách hàng sau khi thanh toán thành công hoặc thất bại.
│   │   ├── Dockerfile
│   │   └── app/
│   │   └── .env
│   │   └── requirements.txt
│   │   └── readme.md     
│   ├── payment-service/            # Quản lý việc xử lý thanh toán vé xem phim trực tuyến.
│   │   ├── Dockerfile
│   │   └── app/
│   │   └── .env
│   │   └── requirements.txt
│   │   └── readme.md   
│   ├── seat-service/               # Quản lý thông tin ghế ngồi và tình trạng ghế ngồi của các suất chiếu.
│   │   ├── Dockerfile
│   │   └── app/
│   │   └── .env
│   │   └── requirements.txt
│   │   └── readme.md   # Service B instructions and description
├── gateway/                        # Xử lý xác thực JWT và điều hướng request đến các service phù hợp
│   ├── Dockerfile
│   ├── .mvn/wrapper
│   │   └── maven-wrapper.properties
│   ├── .dockerignore
│   ├── .gitattributes
│   ├── .gitignore
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src/
└── frontend                        # Giao diện
    ├── booking-ticket-app
    └── readme.md

```

---

## 🚀 Cài đặt

1. **Clone this repository**

   ```bash
   git clone https://github.com/jnp2018/mid-project-347359563.git
   cd mid-project-347359563
   ```

2. **Run with Docker Compose**

   ```bash
   docker compose up -d
   ```
3. **Stop with Docker Compose**

   ```bash
   docker compose down
   ```
---
## Các thành viên

| Tên               | Mã sinh viên | Sự đóng góp                                                                         |
|-------------------|------------|-----------------------------------------------------------------------------------------------|
| Cao Bá Hiếu  | B21DCCN347 | 40% |
| Mai Xuân Hiếu | B21DCCN359 | 30%                          |
| Trần Thị Kim Ngân   | B21DCCN563 | 30%                                 |


Good luck! 💪🚀

