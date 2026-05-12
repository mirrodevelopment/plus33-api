package fr.plus33.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "animations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Animation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "animation_type", length = 50)
    private AnimationType animationType;

    @Column(length = 500)
    private String description;

    @Column(name = "css_class", length = 100)
    private String cssClass;

    @Column(name = "js_trigger", length = 100)
    private String jsTrigger;

    @Column(name = "page_target", length = 100)
    private String pageTarget;

    @Column(name = "element_selector", length = 200)
    private String elementSelector;

    // Animation configuration JSON
    @Column(name = "config_json", columnDefinition = "TEXT")
    private String configJson;

    @Column(name = "duration_ms")
    private Integer durationMs = 600;

    @Column(name = "delay_ms")
    private Integer delayMs = 0;

    @Column(name = "easing", length = 100)
    private String easing = "cubic-bezier(0.4, 0, 0.2, 1)";

    @Column(name = "is_active")
    private Boolean active = true;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum AnimationType {
        PARALLAX,
        SMOOTH_SCROLL,
        HOVER_ZOOM,
        GLASS_TRANSITION,
        LUXURY_LOADER,
        PAGE_REVEAL,
        MAGNETIC_BUTTON
    }
}
