# Notification Service
 
 ## Overview
 **Notification Service** là một microservice được xây dựng để quản lý thông báo đặt vé thành công hoặc thất bại đến email của khách hàng. Đây là một phần trong hệ thống đặt vé phim đa dịch vụ.
 - `Notification Service` nhận message có event `PAYMENT_NOTIFICATION` từ queue `notification_queue` được gửi từ `Payment Service` thì gửi thông báo đặt vé thành công hoặc thất bại tương ứng với `status` nhận được.
 ## Setup
 - Dịch vụ được đóng gói và xây dựng thông qua `Dockerfile` đi kèm.
 - Source code trong `app/` folder.

 ## Environment Variables
    File `.env` đã được cung cấp sẵn trong thư mục gốc. Tuy nhiên, bạn **nên kiểm tra và chỉnh sửa** lại thông tin kết nối cho phù hợp với môi trường của mình.

    Cấu trúc file .env gồm các biến sau:
      DATABASE_URL=mysql+pymysql://root:your_password@mysql:3306/notification_service
      SMTP_SERVER=smtp.gmail.com
      EMAIL=your_email
      PASSWORD=your_password
      RABBITMQ_URL=amqp://guest:guest@rabbitmq/

 ## Development
 - Định nghĩa API theo file OpenAPI: `docs/api-specs/notification_service.yaml`.
 
 ## Endpoints
 - URL: `http://localhost:8006/`
