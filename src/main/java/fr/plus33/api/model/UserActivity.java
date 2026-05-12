package fr.plus33.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "category_id")
    private Long categoryId;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", length = 50)
    private ActivityType activityType;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "time_of_day", length = 20)
    private String timeOfDay;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum ActivityType {
        VIEW, ADD_TO_CART, PURCHASE, FAVORITE, SEARCH, REVIEW, SHARE
    }
}
