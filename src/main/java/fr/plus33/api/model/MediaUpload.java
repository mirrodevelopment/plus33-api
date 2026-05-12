package fr.plus33.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "media_uploads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_filename", length = 255)
    private String originalFilename;

    @Column(name = "stored_filename", length = 255)
    private String storedFilename;

    @Column(name = "public_url", length = 1000)
    private String publicUrl;

    @Column(name = "cloudinary_public_id", length = 255)
    private String cloudinaryPublicId;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", length = 20)
    private MediaType mediaType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @Column(name = "duration_seconds")
    private Double durationSeconds;

    @Column(name = "alt_text", length = 300)
    private String altText;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum MediaType {
        IMAGE, VIDEO
    }
}
