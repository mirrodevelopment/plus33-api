package fr.plus33.api.service;

import fr.plus33.api.dto.ProductDto;
import fr.plus33.api.model.Category;
import fr.plus33.api.model.Product;
import fr.plus33.api.repository.CategoryRepository;
import fr.plus33.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@SuppressWarnings("null")

public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ── CRUD ────────────────────────────────────────────────────────────────

    public Page<ProductDto> getAllProducts(int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());
        return productRepository.findByActiveTrue(pageable).map(this::toDto);
    }

    public Page<ProductDto> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::toDto);
    }

    public ProductDto getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        return toDto(p);
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product p = fromDto(dto, new Product());
        return toDto(productRepository.save(p));
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        fromDto(dto, p);
        return toDto(productRepository.save(p));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        p.setActive(false);
        productRepository.save(p);
    }

    // ── Special Collections ─────────────────────────────────────────────────

    public List<ProductDto> getFeatured() {
        return productRepository.findByFeaturedTrueAndActiveTrueOrderByOrderCountDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getNewArrivals() {
        return productRepository.findNewArrivals(PageRequest.of(0, 12))
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getBestsellers() {
        return productRepository.findByBestsellerTrueAndActiveTrueOrderByOrderCountDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ProductDto> getTopRated() {
        return productRepository.findTopRated(PageRequest.of(0, 12))
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public Page<ProductDto> searchProducts(String query, int page, int size) {
        return productRepository.searchProducts(query, PageRequest.of(page, size)).map(this::toDto);
    }

    // ── Mappers ─────────────────────────────────────────────────────────────

    private ProductDto toDto(Product p) {
        ProductDto dto = new ProductDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setShortDescription(p.getShortDescription());
        dto.setPrice(p.getPrice());
        dto.setComparePrice(p.getComparePrice());
        dto.setSku(p.getSku());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
        }
        dto.setPrimaryImage(p.getPrimaryImage());
        dto.setImages(p.getImages());
        dto.setTags(p.getTags());
        dto.setProductType(p.getProductType() != null ? p.getProductType().name() : null);
        dto.setFeatured(p.getFeatured());
        dto.setNewArrival(p.getNewArrival());
        dto.setBestseller(p.getBestseller());
        dto.setActive(p.getActive());
        dto.setStockQuantity(p.getStockQuantity());
        dto.setRatingAverage(p.getRatingAverage());
        dto.setRatingCount(p.getRatingCount());
        dto.setOrderCount(p.getOrderCount());
        dto.setSlug(p.getSlug());
        dto.setSeasonalRelevance(p.getSeasonalRelevance());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }

    private Product fromDto(ProductDto dto, Product p) {
        if (dto.getName() != null) p.setName(dto.getName());
        if (dto.getDescription() != null) p.setDescription(dto.getDescription());
        if (dto.getShortDescription() != null) p.setShortDescription(dto.getShortDescription());
        if (dto.getPrice() != null) p.setPrice(dto.getPrice());
        if (dto.getComparePrice() != null) p.setComparePrice(dto.getComparePrice());
        if (dto.getSku() != null) p.setSku(dto.getSku());
        if (dto.getPrimaryImage() != null) p.setPrimaryImage(dto.getPrimaryImage());
        if (dto.getImages() != null) p.setImages(dto.getImages());
        if (dto.getTags() != null) p.setTags(dto.getTags());
        if (dto.getFeatured() != null) p.setFeatured(dto.getFeatured());
        if (dto.getNewArrival() != null) p.setNewArrival(dto.getNewArrival());
        if (dto.getBestseller() != null) p.setBestseller(dto.getBestseller());
        if (dto.getActive() != null) p.setActive(dto.getActive());
        if (dto.getStockQuantity() != null) p.setStockQuantity(dto.getStockQuantity());
        if (dto.getSeasonalRelevance() != null) p.setSeasonalRelevance(dto.getSeasonalRelevance());
        if (dto.getProductType() != null) {
            try {
                p.setProductType(Product.ProductType.valueOf(dto.getProductType()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + dto.getCategoryId()));
            p.setCategory(cat);
        }
        return p;
    }
}
