package fr.plus33.api.repository;

import fr.plus33.api.model.MediaUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaUploadRepository extends JpaRepository<MediaUpload, Long> {
    List<MediaUpload> findByMediaTypeAndActiveTrueOrderByCreatedAtDesc(MediaUpload.MediaType mediaType);
    List<MediaUpload> findByActiveTrueOrderByCreatedAtDesc();
}
