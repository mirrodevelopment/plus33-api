package fr.plus33.api.service;

import fr.plus33.api.dto.CategoryDto;
import fr.plus33.api.model.Category;
import fr.plus33.api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@SuppressWarnings("null")

public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));
        return toDto(cat);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Category already exists: " + dto.getName());
        }
        Category cat = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .iconClass(dto.getIconClass())
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        return toDto(categoryRepository.save(cat));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));
        if (dto.getName() != null)
            cat.setName(dto.getName());
        if (dto.getDescription() != null)
            cat.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null)
            cat.setImageUrl(dto.getImageUrl());
        if (dto.getIconClass() != null)
            cat.setIconClass(dto.getIconClass());
        if (dto.getDisplayOrder() != null)
            cat.setDisplayOrder(dto.getDisplayOrder());
        if (dto.getActive() != null)
            cat.setActive(dto.getActive());
        return toDto(categoryRepository.save(cat));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));
        cat.setActive(false);
        categoryRepository.save(cat); // soft delete
    }

    // ── Mapper ──────────────────────────────────────────────────────────────
    private CategoryDto toDto(Category cat) {
        CategoryDto dto = new CategoryDto();
        dto.setId(cat.getId());
        dto.setName(cat.getName());
        dto.setDescription(cat.getDescription());
        dto.setImageUrl(cat.getImageUrl());
        dto.setIconClass(cat.getIconClass());
        dto.setDisplayOrder(cat.getDisplayOrder());
        dto.setActive(cat.getActive());
        dto.setSlug(cat.getSlug());
        dto.setProductCount(cat.getProducts() != null ? cat.getProducts().size() : 0);
        dto.setCreatedAt(cat.getCreatedAt());
        dto.setUpdatedAt(cat.getUpdatedAt());
        return dto;
    }
}
