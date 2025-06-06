# System Architecture

## Overview
- Describe the purpose of the microservices system.

Hệ thống microservices được xây dựng nhằm hỗ trợ đặt vé xem phim trực tuyến một cách nhanh chóng, an toàn và linh hoạt. Người dùng có thể lựa chọn phim, suất chiếu, ghế ngồi, thực hiện thanh toán và nhận vé thông qua email. Hệ thống được thiết kế theo kiến trúc microservices để đảm bảo tính tách biệt, dễ bảo trì và khả năng mở rộng độc lập cho từng chức năng.

- Outline the main components and their responsibilities.

| Service Name  | Responsibility                                |
|---------------|------------------------------------------------|
|ticket booking service|  Quản lý hóa đơn đặt vé xem phim của khách hàng.|
|movie service |  Quản lý thông tin về phim và suất chiếu của phim.|
|customer service |  Quản lý thông tin khách hàng và xác minh đăng nhập.|
|payment service | Quản lý việc xử lý thanh toán vé xem phim trực tuyến. |
|seat service|Quản lý thông tin ghế ngồi và tình trạng ghế ngồi của các suất chiếu.|
|notification service|Gửi email thông báo đặt vé đến khách hàng sau khi thanh toán thành công hoặc thất bại.|
|booking-ticket-app| Giao diện hệ thống đặt vé xem phim.|Next.js, JavaScript, Docker, Docker Compose|
|Gateway| Xử lý xác thực JWT và điều hướng request đến các service phù hợp|

## System Components
- **Booking Ticket Service** là một microservice được xây dựng để quản lý hóa đơn đặt vé xem phim của khách hàng, chịu trách nhiệm chính tạo hóa đơn đặt vé mới cho khách hàng, giao tiếp với `Seat Service` để chuyển trạng thái các ghế vừa chọn thành `reserved`, giao tiếp với Payment Service để cập nhật trạng thái của hóa đơn thành `completed` hoặc `canceled`.
- **Customer Service** là một microservice được xây dựng để quản lý thông tin khách hàng, xử lý đăng nhập và xác thực JWT.
- **Movie Service** là một microservice được xây dựng để quản lý thông tin phim và lịch chiếu của phim.
- **Notification Service** là một microservice được xây dựng để thông báo đặt vé thành công hoặc thất bại đến email của khách hàng khi nhận dữ liệu thanh toán thành công hay thất bại từ `Payment Service`.
- **Payment Service** là một microservice được xây dựng để xử lý thanh toán đặt vé xem phim của khách hàng, có trách nhiệm giao tiếp với `Seat Service`, `Booking Ticket Service`, 
`Notification Service` khi thanh toán thành công hoặc thất bại.
- **Seat Service** là một microservice được xây dựng để quản lý các ghế xem phim của các suất chiếu trong các rạp, có trách nhiệm nhận message được gửi từ `Booking Ticket Service` và `Payment Service` để cập nhật trạng thái ghế được đặt trong suất chiếu.
- **Gateway**: đóng vai trò làm cổng bảo vệ đầu vào cho hệ thống, chịu trách nhiệm xác thực người dùng và kiểm soát truy cập thông qua cơ chế JWT (JSON Web Token).

## Communication
| Service Gửi  | Service Nhận        | Loại kết nối | Phương thức | Đường dẫn                                           | Chức năng                                          |
|--------------|---------------------|--------------|-------------|----------------------------------------------------|---------------------------------------------------|
| API Gateway  | Customer Service    | REST API     | GET         | /api/customers/                                    | Lấy danh sách khách hàng                          |
|              |                     | REST API     | GET         | /api/customers/{customer_id}                       | Lấy thông tin khách hàng theo ID                  |
| API Gateway  | Booking Service     | REST API     | GET         | /api/booking-tickets                               | Lấy danh sách vé                                  |
|              |                     | REST API     | POST        | /api/booking-tickets                               | Tạo vé mới                                        |
|              |                     | REST API     | GET         | /api/booking-tickets/{booking_ticket_id}           | Lấy vé theo ID                                    |
|              |                     | REST API     | PUT         | /api/booking-tickets/{booking_ticket_id}           | Cập nhật vé đặt chỗ                               |
| API Gateway  | Movie Service        | REST API     | GET         | /api/genres                                        | Lấy danh sách thể loại phim                       |
|              |                      | REST API     | GET         | /api/movies                                        | Lấy danh sách phim                                |
|              |                      | REST API     | GET         | /api/movies/{movie_id}                             | Lấy phim theo ID                                  |
|              |                      | REST API     | GET         | /api/showtimes                                     | Lấy danh sách suất chiếu                          |
|              |                      | REST API     | GET         | /api/showtimes/movie/{movie_id}                    | Lấy danh sách suất chiếu theo phim                |
| API Gateway  | Notification Service| REST API     | POST        | /api/notifications                                 | Tạo thông báo mới                                 |
| API Gateway  | Seat Service        | REST API     | GET         | /api/seats/                                        | Lấy danh sách ghế                                 |
|              |                     | REST API     | PUT         | /api/seats/{seat_id}                               | Cập nhật thông tin ghế                            |
|              |                     | REST API     | GET         | /api/seat-status/                                  | Lấy danh sách trạng thái ghế                      |
|              |                     | REST API     | GET         | /api/seat-status/{seat_status_id}                 | Lấy thông tin trạng thái ghế cụ thể               |
|              |                     | REST API     | PUT         | /api/seat-status/{seat_status_id}                 | Cập nhật trạng thái ghế                           |
|              |                     | REST API     | PUT         | /api/seat-status/{seat_status_id}/reserve         | Giữ chỗ ghế xem phim                              |
|              |                     | REST API     | PUT         | /api/seat-status/{seat_status_id}/cancel          | Hủy giữ chỗ ghế                                   |
| API Gateway  | Payment Service     | REST API     | POST        | /api/payments                                     | Tạo thanh toán mới                                |
|              |                     | REST API     | GET         | /api/payments/pay/place                           | Tạo URL thanh toán VNPAY và redirect              |
|              |                     | REST API     | GET         | /api/payments/pay/payment_return                  | Xử lý callback từ VNPAY                           |
| Booking Ticket Service  | Seat Service           | RabbitMQ      | Message                                    | { "event": "RESERVE_SEAT_NOTIFICATION", "booking_ticket_id": int, "customer_id": int, "seat_status_ids": [int] }       | Khi Seat Service sẽ cập nhật trạng thái các ghế trong nội thành "RESERVED" |
|Payment service | Notification service | RabbitMQ  | Message |{"event": "PAYMENT_NOTIFICATION","booking_ticket_id": data.booking_ticket_id,"payment_id": data.payment_id,"customer_id": data.customer_id,"status": "success" hoặc "fail","email": data.email}| Khi Notification service gửi thông báo thanh toán đến email trong nội dung|
|Payment service | Seat service | RabbitMQ  | Message |{"event": "PAYMENT_NOTIFICATION","booking_ticket_id": data.booking_ticket_id,"payment_id": data.payment_id,"customer_id": data.customer_id,"status": "success" hoặc "fail","email": data.email}| Khi Seat Service sẽ cập nhật trạng thái các ghế thành "booked" hoặc "available" tùy theo trạng thái thanh toán                      ||
|Payment service | Booking Ticket Service | RabbitMQ  | Message |{"event": "PAYMENT_NOTIFICATION","booking_ticket_id": data.booking_ticket_id,"payment_id": data.payment_id,"customer_id": data.customer_id,"status": "success" hoặc "fail","email": data.email}| Khi Booking Ticket Service nhân được nội dung sẽ cập nhật trạng thái thành công hoặc thất bại theo "booking_ticket_id" |
## Data Flow

![Data flow diagram](asset/data%20flow.jpg)
### Bước 1: Đăng nhập
- Thông tin tài khoản được khách hàng nhập vào từ giao diện sẽ được gửi đến API Gateway
- API Gateway chuyển dữ liệu đến Customer service
- Customer service kiểm tra thông tin tài khoản trong customer_db
- Customer service trả về kết quả cho API Gateway
- API Gateway trả kết quả về Web UI
### Bước 2: Lấy danh sách phim
- Web UI gửi yêu cầu lấy danh sách phim đến API Gateway
- API Gateway chuyển yêu cầu lấy danh sách đến Movie service
- Movie service lấy danh sách phim trong movie_db
- Movie service gửi dữ liệu về cho API Gateway
- API Gateway gửi dữ liệu danh sách phim cho Web UI
- Web UI hiển thị danh sách phim cho Customer
### Bước 3: Chọn phim
- Customer chọn 1 phim trên giao diện Web UI
- Web UI gửi id phim đến API Gateway
- API Gateway chuyển yêu cầu lấy danh sách xuất chiếu theo ID phim vừa chọn đến Movie service
- Movie service lấy danh sách xuất chiếu theo ID từ movie_db
- Movie service gửi dữ liệu lấy được về API Gateway
- API Gateway trả dữ liệu xuất chiếu về Web UI
- Web UI hiển thị danh sách xuất chiếu cho Customer
### Bước 4: Lấy danh sách ghế ngồi
- Customer chọn 1 xuất chiếu trên giao diện
- Web UI gửi id xuất chiếu cho API Gateway
- API Gateway chuyển id xuất chiếu cho Seat service và yêu cầu lấy danh sách ghế ngồi
- Seat service lấy danh sách ghế ngồi từ seat_db 
- Seat service gửi danh sách ghế ngồi về cho API Gateway
- API Gateway gửi dữ liệu cho Web UI 
- Web UI hiển thị danh sách ghế ngồi cho Customer
### Bước 5: Chọn các ghế ngồi kiểm tra thông tin khách hàng và thanh toán
- Customer chọn danh sách ghế ngồi trên màn hình + nhấn vào thông tin khách hàng (sửa thông tin nếu muốn) + nhấn nút thanh toán
- Web UI gửi dữ liệu cho API Gateway
- API Gateway gửi dữ liệu cho Ticket booking service yêu cầu lưu ticket_booking
- Ticket booking service gửi message: "RESERVE_SEAT_NOTIFICATION" với nội dung là danh sách các ghế được chọn lên RabitMQ
- Seat service nhận message"RESERVE_SEAT_NOTIFICATION" từ RabitMQ
- Seat service cập nhật trạng thái các ghế trong lấy trong message"RESERVE_SEAT_NOTIFICATION" ở seat_db
- Web UI gửi dữ liệu cho API Gateway 
- API Gateway  gửi dữ liệu đến Payment service yêu cầu thanh toán hóa đơn
- Payment service tạo URL thanh toán và truy cập đến VNPAY API theo URL
- Customer thanh toán qua VNPAY API
- VNPAY API gửi kết quả thanh toán về Payment service 
- Payment service lưu thông tin thanh toán vào payment_db
- Payment service 3 message "PAYMENT_NOTIFICATION" lên RabitMQ
- Payment service trả về kết quả thanh toán cho API Gateway
- API Gateway trả kết quả về Web UI 
- Web UI hiển thị thông tin vé đã mua cho Customer
### Bước 6 Gửi thông báo, cập nhật trạng thái ghế ngồi và trạng thái ticket_booking
- Notification service nhận message "PAYMENT_NOTIFICATION" từ RabitMQ
- Notification service lưu dữ liệu vào notification_db
- Seat service message "PAYMENT_NOTIFICATION" từ RabitMQ 
- Seat service cập nhật trạng thái danh sách ghế ngồi lấy từ message trên seat_db.
- Ticket booking service nhận message "PAYMENT_NOTIFICATION" từ RabitMQ 
- Ticket booking service cập nhật lại trạng thái ticket_booking trên ticket_booking_db


## Diagram
![high-level architecture diagram](asset/high-level%20_architecture%20_diagram.jpg)
