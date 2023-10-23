# HomeScape

This is a personal project for a real estate demo website using Vite (React.js), Spring Boot and MySQL.

## Details

The website has the following functionalities:

- Authentication: The website has registration with email verification, login and forgot password functionalities.
- Search: There are filters based on different criteria such as location, price range, area range,...
- Property View: Property's images, videos and panorama images can be viewed along with information about the property
- Add/Remove Favorites: Each property can be added or removed from user's favorite list
- Profile: User can change their profile information and avatar

## Technology

- Front-end:
  - Vite
  - React.js
  - TailwindCSS
- Back-end:
  - Spring Boot
- Database: MySQL
- Services:
  - SendGrid
  - AWS S3 Storage

## Installation

Prerequisites:

- Node.js
- JDK 17
- MySQL 8
- Maven

Install front-end packages:

```bash
cd frontend
npm install --legacy-peer-deps
```

Create "application.properties" in /src/resources with the following attributes:

```
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

jwt.secret=
jwt.expiration=

sendgrid.api-key=
sendgrid.from-email=
sendgrid.verify-email-template=
sendgrid.reset-email-template=

aws.bucket-name=
aws.access-key=
aws.secret-key=
```

Run the application:

```bash
mvn spring-boot:run
```
