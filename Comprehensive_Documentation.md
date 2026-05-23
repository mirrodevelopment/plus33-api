# Plus33 Enterprise Architecture & Project Documentation

Welcome to the comprehensive, enterprise-grade documentation for the **Plus33** project. This document provides a highly detailed, 15-section breakdown of the entire software ecosystem, designed for both onboarding beginners and aligning senior engineering teams.

---

## 1. Project Overview

* **Project Name**: Plus33 Digital Ecosystem
* **Purpose of the project**: To provide a seamless, ultra-luxury digital experience for a Paris-inspired premium coffee franchise. It unifies a high-end web presence with robust backend management.
* **Real-world problem it solves**: Standard coffee shop websites lack the cinematic, experiential storytelling required by premium brands. Plus33 solves this by delivering a high-fidelity visual experience (GSAP animations, parallax) coupled with a scalable e-commerce and catalog management backend.
* **Target users/customers**: Premium coffee consumers, potential franchise investors, and brand enthusiasts who expect a luxurious digital interaction.
* **Main business goals**: Increase brand prestige, drive online engagement, facilitate product discovery, and support global franchise expansion (Paris, London, Dubai, Switzerland).
* **Industry/domain relevance**: Food & Beverage (F&B), Luxury E-commerce, Retail Technology.
* **Why this project is important**: It sets a new benchmark in the luxury digital F&B space by leveraging cinematic frontend technologies driven by an enterprise Java Spring Boot backbone.

---

## 2. Full Architecture Explanation

The Plus33 application follows a **Decoupled Client-Server Architecture** separating the visual frontend presentation from the backend business logic and data persistence layers.

* **High-level architecture**: A Single Page Application (SPA) style frontend communicating asynchronously with a stateless RESTful Java backend.
* **Frontend architecture**: Powered by Vite, utilizing Vanilla JavaScript, modular CSS, and GSAP. It is heavily componentized (components/navbar, components/footer) and relies on an internal client-side router (`router.js`) to mimic SPA behavior without a heavy framework like React.
* **Backend architecture**: Built on Spring Boot 3.3.5. It follows a classic layered architecture: Controllers (API endpoints) -> Services (Business Logic) -> Repositories (Data Access) -> Database. Data Transfer Objects (DTOs) are used strictly to prevent entity exposure.
* **Database architecture**: Relational Database Management System (RDBMS). H2 is used for local development/rapid prototyping, while MySQL is the target for production.
* **API architecture**: RESTful JSON APIs structured around core domains (Products, Categories, Media, AI Recommendations).
* **Deployment architecture**: Containerized using Docker (`compose.yaml`). The application is designed to be stateless to allow horizontal scaling behind a load balancer.
* **Cloud/storage architecture**: Static assets are served locally in development, but media uploads (images/videos) are outsourced to **Cloudinary**, acting as a cloud Storage & CDN provider.
* **Request-response lifecycle**: 
  1. Client triggers an action (e.g., `api.getProducts()`).
  2. HTTP GET request hits `/api/products`.
  3. `ProductController` intercepts and delegates to `ProductService`.
  4. `ProductService` queries `ProductRepository` (Spring Data JPA).
  5. Entities are mapped to `ProductDto` and returned wrapped in an `ApiResponse` object.
* **Scalability strategy**: Stateless backend, externalized media storage (Cloudinary), and a lightweight frontend bundle (Vite).
* **Security architecture**: Currently relying on Spring Security with CORS configurations. CSRF is disabled for API flexibility, and sessions are stateless.
* **Enterprise design principles used**: Separation of Concerns (SoC), Data Transfer Object (DTO) Pattern, Dependency Injection (DI).

---

## 3. Technology Stack

### Backend Technologies
* **Java 21**: Chosen for modern features like virtual threads, pattern matching, and long-term support (LTS) performance benefits.
* **Spring Boot 3.3.5**: The industry standard for enterprise Java. Accelerates development with auto-configuration and embedded servers (Tomcat).
* **Spring Data JPA & Hibernate**: Abstracts SQL complexities, providing rapid object-relational mapping (ORM) and data access.
* **Lombok**: Reduces boilerplate code (getters, setters, builders), enhancing code readability and maintainability.

### Frontend Technologies
* **Vite**: A next-generation frontend tooling. Chosen over Webpack for its instant hot module replacement (HMR) and highly optimized build process.
* **Vanilla JavaScript (ES6+)**: Keeps the bundle size incredibly small and performant without the overhead of heavy frameworks like React/Angular.
* **GSAP (GreenSock Animation Platform)**: The gold standard for web animations. Used for complex parallax, scroll-triggers, and cinematic transitions.

### Database & Cloud
* **H2 Database**: In-memory database used for zero-configuration local development.
* **MySQL**: The target production relational database. Highly reliable and scalable.
* **Cloudinary**: Cloud-based media management. Selected for its on-the-fly image optimization, resizing, and global CDN delivery, offloading heavy media traffic from the main server.

---

## 4. Folder Structure Explanation

### Backend (`src/main/java/fr/plus33/api`)
* **`config/`**: Contains core application configurations (e.g., `SecurityConfig`, `WebMvcConfig`). Exists to centralize environment and security rules.
* **`controller/`**: Houses the REST endpoints (`ProductController`, `CategoryController`). Responsible exclusively for HTTP request/response handling.
* **`dto/`**: Data Transfer Objects (`ProductDto`, `ApiResponse`). Best practice to decouple database entities from API payloads.
* **`model/`**: JPA Entities (`Product`, `Category`). These map exactly to database tables.
* **`repository/`**: Interfaces extending `JpaRepository`. Provides automatic CRUD operations.
* **`service/`**: Contains business logic (`ProductService`). Acts as the middleman between controllers and repositories.

### Frontend (`plus33-frontend/`)
* **`css/`**: Modular CSS. Subfolders for `animations/` (GSAP specific styles), `components/` (navbar, footer), `global/` (reset, typography, variables), and `pages/`.
* **`js/`**:
  * `api/`: Centralized API fetch logic (`api.js`).
  * `components/`: UI logic (`navbar.js`).
  * `pages/`: View-specific logic.
  * `router/`: Client-side routing logic to switch views dynamically.
* **`templates/`**: Raw HTML files that are injected into the DOM by the router.

---

## 5. Feature-by-Feature Breakdown

### 1. Product Catalog & Management
* **Purpose**: Display the luxury coffee and merchandise offerings.
* **User Flow**: User navigates to the Boutique page -> Grid of products loads -> Filters can be applied.
* **Backend Logic**: `ProductController` handles pagination, sorting, and filtering via `ProductService`.
* **Database Operations**: `Pageable` queries executed by Spring Data JPA.
* **Performance Optimization**: Pagination natively implemented (`?page=0&size=12`) to prevent massive payload transfers.

### 2. Cloudinary Media Upload System
* **Purpose**: Handle high-res imagery for products and banners without bloating the server.
* **Backend Logic**: `MediaController` accepts `MultipartFile`, communicates with the Cloudinary SDK, and returns the secure CDN URL.
* **Security Checks**: Configured max-file-size (50MB) to prevent denial-of-service (DoS) via massive uploads.

### 3. AI Recommendation Engine (Placeholder/Foundation)
* **Purpose**: Future-proofing the app to suggest products based on user activity.
* **Backend Logic**: `AiRecommendationController` is set up. `Product` model includes fields like `aiEmbeddingVector` and `aiTags` to support future vector-based similarity searches.

---

## 6. Database Design

The relational database uses a highly normalized structure.

### Core Tables:
* **`categories`**:
  * **Columns**: `id` (PK), `name`, `slug`, `image_url`, `is_active`.
  * **Purpose**: Groups products.
* **`products`**:
  * **Columns**: `id` (PK), `name`, `price`, `sku`, `category_id` (FK), `slug`, `ai_embedding_vector`.
  * **Relationships**: Many-to-One with `categories`.
  * **Indexing**: Primary keys are auto-indexed. Slug fields are dynamically generated via `@PrePersist` hooks for SEO-friendly URLs.
* **`product_images` / `product_tags`**:
  * Created via `@ElementCollection`. These are separate tables linked by `product_id` to handle 1-to-N relationships without needing full entity classes for simple strings.

---

## 7. API Documentation

### Example: Get Products
* **Endpoint URL**: `/api/products`
* **HTTP Method**: `GET`
* **Query Params**: `page` (int), `size` (int), `sort` (string), `categoryId` (long), `q` (search string).
* **Response Body**:
  ```json
  {
    "success": true,
    "message": null,
    "data": {
      "content": [ { "id": 1, "name": "Parisian Roast", "price": 45.00 } ],
      "pageable": { "pageNumber": 0, "pageSize": 12 },
      "totalElements": 1
    }
  }
  ```
* **Status Codes**: 200 OK.
* **Error Responses**: 404 if page out of bounds (handled via global exception handler).

---

## 8. Authentication & Security

* **Current State**: The API is currently open for public access, tailored for the initial catalog display phase.
* **CORS Handling**: Cross-Origin Resource Sharing is explicitly configured in `SecurityConfig.java` to allow the Vite dev server (`http://localhost:5173`) and the production domain (`https://plus33.in`).
* **Session Handling**: Configured as `STATELESS`. The backend relies entirely on tokens/requests rather than server-side HTTP sessions.
* **XSS & SQL Injection Prevention**: Hibernate/JPA automatically sanitizes all database queries via prepared statements, eliminating SQL injection. Modern frontend practices (using textContent vs innerHTML) mitigate XSS.

---

## 9. Frontend UI/UX System

* **Design Philosophy**: "Cinematic Minimalism". The UI utilizes deep contrasting colors, elegant typography, and massive use of negative space to convey luxury.
* **Animation System**: GSAP (GreenSock) handles all heavy lifting. `parallax.js` ties DOM elements to scroll positions, creating depth.
* **Responsive Strategy**: CSS Flexbox and CSS Grid are used with a mobile-first approach. Global variables (`variables.css`) manage breakpoints and scaling.
* **Component System**: Even without React, the UI is broken into reusable HTML/JS snippets (Navbar, Footer) which are dynamically injected, ensuring DRY (Don't Repeat Yourself) principles.

---

## 10. Deployment & DevOps

* **Docker Setup**: A `compose.yaml` exists to orchestrate the backend, database, and potentially the frontend in unified containers.
* **Environment Variables**: Managed via `application.properties`. Cloudinary keys and database credentials are externalized.
* **Hosting Setup**: Designed to run via `java -jar` on a Linux VPS or cloud provider (AWS/GCP), with the frontend served either by a CDN (Vercel/Netlify) or standard Nginx reverse proxy.

---

## 11. Performance Optimization

* **Database Optimization**: Lazy Loading (`FetchType.LAZY`) is used on entity relationships (e.g., `Product` -> `Category`) to prevent N+1 query problems and massive memory overheads.
* **Frontend Optimization**: Vite bundles the JavaScript, treeshaking unused code. GSAP animations are optimized using `requestAnimationFrame` under the hood.
* **Image Optimization**: Cloudinary handles auto-format (`f_auto`) and auto-quality (`q_auto`) serving WebP/AVIF formats dynamically based on the user's browser.

---

## 12. Enterprise-Level Best Practices

* **DTO Pattern**: Entities (`Product.java`) never leave the backend. They are mapped to `ProductDto.java` before reaching the Controller. This prevents exposing internal database structures or sensitive fields to the frontend.
* **Standardized API Responses**: Every API endpoint returns a wrapped `ApiResponse<T>` generic class. This guarantees the frontend always receives a consistent payload structure (`success`, `message`, `data`).
* **Validation**: Utilizing `jakarta.validation` annotations (`@NotBlank`, `@DecimalMin`) on entities and DTOs to enforce data integrity before it hits the database layer.

---

## 13. Future Improvements

* **JWT Authentication**: Implementing a robust JSON Web Token (JWT) system via Spring Security for Admin/Dashboard access.
* **Redis Caching**: Introducing Redis to cache the `/api/products` endpoints, reducing database hits for heavily trafficked pages.
* **Vector Database Integration**: Utilizing the `aiEmbeddingVector` fields in the database alongside a specialized vector DB (like Pinecone or pgvector) to power true semantic search and AI product recommendations.
* **Payment Gateway**: Integration with Stripe or PayPal for full e-commerce checkout flows.

---

## 14. Developer Notes

### Setup Instructions
1. **Prerequisites**: Java 21, Node.js 18+, Maven.
2. **Backend Execution**:
   - Navigate to `d:\webprojects\plus33-api`
   - Run `./mvnw spring-boot:run`
   - The API will start on `http://localhost:8083`
3. **Frontend Execution**:
   - Navigate to `d:\webprojects\plus33-api\plus33-frontend`
   - Run `npm install` followed by `npm run dev`
   - Access the site via the Vite localhost link provided in the terminal.

### Debugging Tips
- To view the database directly during local dev, navigate to `http://localhost:8083/h2-console`. (Username: `sa`, Password: `[blank]`, JDBC URL: `jdbc:h2:mem:plus33db`).

---

## 15. Code Explanation

### The Security Configuration (`SecurityConfig.java`)
**What it does**: Determines who can access the API and how browsers handle cross-origin requests.
**Why it was written this way**:
```java
http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
    .csrf(csrf -> csrf.disable())
    .headers(headers -> headers.frameOptions(frame -> frame.disable()))
    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```
* `csrf.disable()`: APIs consumed by separate SPA frontends typically disable CSRF and rely on tokens.
* `frameOptions.disable()`: Strictly required to allow the H2 embedded database console to render inside an iframe during development.
* `SessionCreationPolicy.STATELESS`: Ensures the server doesn't waste memory storing user sessions, fitting the true RESTful paradigm.

---
*End of Complete Project Documentation.*
