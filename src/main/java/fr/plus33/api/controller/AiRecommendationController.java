package fr.plus33.api.controller;

import fr.plus33.api.dto.ApiResponse;
import fr.plus33.api.dto.ProductDto;
import fr.plus33.api.service.AiRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiRecommendationController {

    private final AiRecommendationService aiService;

    /** Personalized recommendations for a specific user */
    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getRecommendations(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getRecommendations(userId)));
    }

    /** Trigger model retraining */
    @PostMapping("/recommendation/train")
    public ResponseEntity<ApiResponse<String>> train() {
        aiService.trainModel();
        return ResponseEntity.ok(ApiResponse.ok("Training triggered", "Model training initiated"));
    }

    /** Globally trending products */
    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getTrending() {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getTrending()));
    }

    /** Personalized feed (same as recommendations but named endpoint) */
    @GetMapping("/personalized")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getPersonalized(
            @RequestParam(defaultValue = "0") Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(aiService.getPersonalized(userId)));
    }

    /** Record user activity for AI model */
    @PostMapping("/recent-activity")
    public ResponseEntity<ApiResponse<String>> recordActivity(@RequestBody Map<String, Object> body) {
        Long userId = Long.parseLong(body.getOrDefault("userId", "0").toString());
        Long productId = body.get("productId") != null ? Long.parseLong(body.get("productId").toString()) : null;
        Long categoryId = body.get("categoryId") != null ? Long.parseLong(body.get("categoryId").toString()) : null;
        String activityType = body.getOrDefault("activityType", "VIEW").toString();
        aiService.recordActivity(userId, productId, categoryId, activityType);
        return ResponseEntity.ok(ApiResponse.ok("Recorded", "Activity recorded"));
    }
}
