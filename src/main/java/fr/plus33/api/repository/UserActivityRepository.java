package fr.plus33.api.repository;

import fr.plus33.api.model.UserActivity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    List<UserActivity> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT ua.productId FROM UserActivity ua WHERE ua.userId = :userId GROUP BY ua.productId ORDER BY COUNT(ua.id) DESC")
    List<Long> findTopProductIdsByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT ua.categoryId FROM UserActivity ua WHERE ua.userId = :userId GROUP BY ua.categoryId ORDER BY COUNT(ua.id) DESC")
    List<Long> findTopCategoryIdsByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT ua.productId FROM UserActivity ua WHERE ua.createdAt >= :since GROUP BY ua.productId ORDER BY COUNT(ua.id) DESC")
    List<Long> findTrendingProductIds(@Param("since") LocalDateTime since, Pageable pageable);
}
