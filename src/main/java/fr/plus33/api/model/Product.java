package fr.plus33.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "compare_price", precision = 10, scale = 2)
    private BigDecimal comparePrice;

    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(length = 100)
    private String sku;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "primary_image")
    private String primaryImage;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    // Tags for filtering
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type", length = 50)
    private ProductType productType = ProductType.COFFEE;

    @Column(name = "is_featured")
    private Boolean featured = false;

    @Column(name = "is_new_arrival")
    private Boolean newArrival = false;

    @Column(name = "is_bestseller")
    private Boolean bestseller = false;

    @Column(name = "is_active")
    private Boolean active = true;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "rating_average")
    private Double ratingAverage = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "order_count")
    private Integer orderCount = 0;

    @Column(length = 200)
    private String slug;

    // AI recommendation metadata
    @Column(name = "ai_embedding_vector", columnDefinition = "TEXT")
    private String aiEmbeddingVector;

    @Column(name = "ai_tags", columnDefinition = "TEXT")
    private String aiTags;

    @Column(name = "seasonal_relevance", length = 50)
    private String seasonalRelevance;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ProductType {
        COFFEE, LUXURY_PRODUCT, MERCHANDISE, PASTRY, TEA, SEASONAL
    }

    @PrePersist
    @PreUpdate
    public void generateSlug() {
        if (name != null) {
            this.slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }
    }
}
