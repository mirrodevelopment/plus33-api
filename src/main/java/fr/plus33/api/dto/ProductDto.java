package fr.plus33.api.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal comparePrice;
    private String sku;
    private Long categoryId;
    private String categoryName;
    private String primaryImage;
    private List<String> images;
    private List<String> tags;
    private String productType;
    private Boolean featured;
    private Boolean newArrival;
    private Boolean bestseller;
    private Boolean active;
    private Integer stockQuantity;
    private Double ratingAverage;
    private Integer ratingCount;
    private Integer orderCount;
    private String slug;
    private String seasonalRelevance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
