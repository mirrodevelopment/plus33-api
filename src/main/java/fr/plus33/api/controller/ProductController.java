package fr.plus33.api.controller;

import fr.plus33.api.dto.ApiResponse;
import fr.plus33.api.dto.ProductDto;
import fr.plus33.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ── CRUD ─────────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> create(@RequestBody ProductDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(productService.createProduct(dto), "Product created"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q) {

        Page<ProductDto> result;
        if (q != null && !q.isBlank()) {
            result = productService.searchProducts(q, page, size);
        } else if (categoryId != null) {
            result = productService.getProductsByCategory(categoryId, page, size);
        } else {
            result = productService.getAllProducts(page, size, sort);
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> update(@PathVariable Long id, @RequestBody ProductDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(productService.updateProduct(id, dto), "Product updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Product deleted"));
    }

    // ── Special Collections ───────────────────────────────────────────────────

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getFeatured()));
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getNewArrivals() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getNewArrivals()));
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getBestsellers() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getBestsellers()));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getTopRated() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getTopRated()));
    }
}
