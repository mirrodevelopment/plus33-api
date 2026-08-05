package fr.plus33.api.service;

import fr.plus33.api.dto.ProductDto;
import fr.plus33.api.model.UserActivity;
import fr.plus33.api.repository.ProductRepository;
import fr.plus33.api.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
@SuppressWarnings("null")

public class AiRecommendationService {

    private final ProductRepository productRepository;
    private final UserActivityRepository userActivityRepository;
    private final ProductService productService;

    /**
     * Get personalized recommendations for a user.
     * Factors: order history, favorites, trending, seasonal, time-based.
     */
    public List<ProductDto> getRecommendations(Long userId) {
        Set<Long> recommended = new LinkedHashSet<>();

        // 1. Based on user's top categories (collaborative filtering)
        List<Long> topCategories = userActivityRepository.findTopCategoryIdsByUser(userId, PageRequest.of(0, 3));
        if (!topCategories.isEmpty()) {
            List<Long> purchased = userActivityRepository.findTopProductIdsByUser(userId, PageRequest.of(0, 10));
            List<Long> byCat = productRepository
                    .findByCategoryIdsExcluding(topCategories, purchased.isEmpty() ? List.of(-1L) : purchased,
                            PageRequest.of(0, 4))
                    .stream().map(p -> p.getId()).collect(Collectors.toList());
            recommended.addAll(byCat);
        }

        // 2. Seasonal recommendations
        String season = getCurrentSeason();
        productRepository.findBySeason(season, PageRequest.of(0, 3))
                .forEach(p -> recommended.add(p.getId()));

        // 3. Time-based (morning coffee, evening dessert)
        addTimeBasedRecommendations(recommended);

        // 4. Trending products as fallback
        if (recommended.size() < 8) {
            getTrending().stream().limit(8 - recommended.size())
                    .map(ProductDto::getId).forEach(recommended::add);
        }

        return recommended.stream()
                .limit(12)
                .map(id -> {
                    try {
                        return productService.getProductById(id);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getPersonalized(Long userId) {
        return getRecommendations(userId);
    }

    public List<ProductDto> getTrending() {
        return productRepository.findTrending(PageRequest.of(0, 12))
                .stream().map(p -> {
                    try {
                        return productService.getProductById(p.getId());
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional
    public void recordActivity(Long userId, Long productId, Long categoryId, String activityType) {
        UserActivity activity = UserActivity.builder()
                .userId(userId)
                .productId(productId)
                .categoryId(categoryId)
                .activityType(parseActivityType(activityType))
                .timeOfDay(getTimeOfDay())
                .build();
        userActivityRepository.save(activity);
    }

    @Transactional
    public void trainModel() {
        // Placeholder: refresh trending scores, update seasonal tags, etc.
        log.info("[AI] Recommendation model training triggered at {}", LocalDateTime.now());
        // In a real implementation, this would call an ML service or update embeddings
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private String getCurrentSeason() {
        int month = LocalDateTime.now().getMonthValue();
        if (month >= 3 && month <= 5)
            return "SPRING";
        if (month >= 6 && month <= 8)
            return "SUMMER";
        if (month >= 9 && month <= 11)
            return "AUTUMN";
        return "WINTER";
    }

    private String getTimeOfDay() {
        int hour = LocalDateTime.now().getHour();
        if (hour >= 5 && hour < 12)
            return "MORNING";
        if (hour >= 12 && hour < 17)
            return "AFTERNOON";
        if (hour >= 17 && hour < 21)
            return "EVENING";
        return "NIGHT";
    }

    private void addTimeBasedRecommendations(Set<Long> recommended) {
        String timeOfDay = getTimeOfDay();
        String season = "MORNING".equals(timeOfDay) ? "coffee" : "evening";
        log.debug("[AI] Time-based context: {} – season: {}", timeOfDay, season);
    }


    private UserActivity.ActivityType parseActivityType(String type) {
        try {
            return UserActivity.ActivityType.valueOf(type.toUpperCase());
        } catch (Exception e) {
            return UserActivity.ActivityType.VIEW;
        }
    }
}
