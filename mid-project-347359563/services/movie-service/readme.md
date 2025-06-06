# Movie Service
 
 ## Overview
 **Movie Service** là một microservice được xây dựng để quản lý thông tin phim và lịch chiếu của phim. Đây là một phần trong hệ thống đặt vé phim đa dịch vụ.
 
 ## Setup
 - Dịch vụ được đóng gói và xây dựng thông qua `Dockerfile` đi kèm.
 - Source code trong `app/` folder.

 ## Environment Variables
    File `.env` đã được cung cấp sẵn trong thư mục gốc. Tuy nhiên, bạn **nên kiểm tra và chỉnh sửa** lại thông tin kết nối cho phù hợp với môi trường của mình.

    Cấu trúc file .env gồm các biến sau:
    # Database configuration
    DATABASE_URL=mysql+pymysql://root:your_password@mysql:3306/movie_service

 ## Development
 - Định nghĩa API theo file OpenAPI: `docs/api-specs/movie_service.yaml`.
 
 ## Endpoints
 - URL: `http://localhost:8002/`
