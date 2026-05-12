package fr.plus33.api.controller;

import fr.plus33.api.dto.ApiResponse;
import fr.plus33.api.model.MediaUpload;
import fr.plus33.api.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<MediaUpload>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            MediaUpload uploaded = mediaService.uploadImage(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(uploaded, "Image uploaded"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    @PostMapping("/video")
    public ResponseEntity<ApiResponse<MediaUpload>> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            MediaUpload uploaded = mediaService.uploadVideo(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(uploaded, "Video uploaded"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload video: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Media deleted"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MediaUpload>>> getAll(
            @RequestParam(required = false) String type) {
        List<MediaUpload> results = type != null
                ? mediaService.getByType(MediaUpload.MediaType.valueOf(type.toUpperCase()))
                : mediaService.getAll();
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}
