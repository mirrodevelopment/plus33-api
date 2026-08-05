package fr.plus33.api.service;

import fr.plus33.api.model.MediaUpload;
import fr.plus33.api.repository.MediaUploadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@SuppressWarnings("null")

public class MediaService {

    private final MediaUploadRepository mediaUploadRepository;

    @Value("${plus33.upload.dir:uploads}")
    private String uploadDir;

    @Transactional
    public MediaUpload uploadImage(MultipartFile file) throws IOException {
        return saveFile(file, MediaUpload.MediaType.IMAGE);
    }

    @Transactional
    public MediaUpload uploadVideo(MultipartFile file) throws IOException {
        return saveFile(file, MediaUpload.MediaType.VIDEO);
    }

    private MediaUpload saveFile(MultipartFile file, MediaUpload.MediaType type) throws IOException {
        String dir = uploadDir + "/" + type.name().toLowerCase();
        Path uploadPath = Paths.get(dir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String storedFilename = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(storedFilename);
        Files.copy(file.getInputStream(), filePath);

        MediaUpload media = MediaUpload.builder()
                .originalFilename(originalFilename)
                .storedFilename(storedFilename)
                .publicUrl("/uploads/" + type.name().toLowerCase() + "/" + storedFilename)
                .mediaType(type)
                .fileSize(file.getSize())
                .mimeType(file.getContentType())
                .active(true)
                .build();

        return mediaUploadRepository.save(media);
    }

    public List<MediaUpload> getAll() {
        return mediaUploadRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public List<MediaUpload> getByType(MediaUpload.MediaType type) {
        return mediaUploadRepository.findByMediaTypeAndActiveTrueOrderByCreatedAtDesc(type);
    }

    @Transactional
    public void deleteMedia(Long id) {
        MediaUpload m = mediaUploadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found: " + id));
        m.setActive(false);
        mediaUploadRepository.save(m);
    }
}
