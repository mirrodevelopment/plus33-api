package fr.plus33.api.controller;

import fr.plus33.api.dto.ApiResponse;
import fr.plus33.api.model.Animation;
import fr.plus33.api.service.AnimationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animations")
@RequiredArgsConstructor
public class AnimationController {

    private final AnimationService animationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Animation>>> getAll(
            @RequestParam(required = false) String page) {
        List<Animation> result = page != null
                ? animationService.getByPage(page)
                : animationService.getAll();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/homepage")
    public ResponseEntity<ApiResponse<List<Animation>>> getHomepage() {
        return ResponseEntity.ok(ApiResponse.ok(animationService.getHomepageAnimations()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Animation>> create(@RequestBody Animation animation) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(animationService.create(animation), "Animation created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Animation>> update(@PathVariable Long id, @RequestBody Animation animation) {
        return ResponseEntity.ok(ApiResponse.ok(animationService.update(id, animation), "Animation updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        animationService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Animation deleted"));
    }
}
