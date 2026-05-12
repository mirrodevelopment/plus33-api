package fr.plus33.api.repository;

import fr.plus33.api.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ── Core Filters ────────────────────────────────────────────────────────
    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    Optional<Product> findBySlug(String slug);

    // ── Special collections ─────────────────────────────────────────────────
    List<Product> findByFeaturedTrueAndActiveTrueOrderByOrderCountDesc();

    @Query("SELECT p FROM Product p WHERE p.newArrival = true AND p.active = true ORDER BY p.createdAt DESC")
    List<Product> findNewArrivals(Pageable pageable);

    List<Product> findByBestsellerTrueAndActiveTrueOrderByOrderCountDesc();

    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.ratingAverage DESC, p.ratingCount DESC")
    List<Product> findTopRated(Pageable pageable);

    // ── AI Recommendation queries ───────────────────────────────────────────
    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.orderCount DESC")
    List<Product> findTrending(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.id IN :categoryIds AND p.active = true AND p.id NOT IN :excludeIds ORDER BY p.ratingAverage DESC")
    List<Product> findByCategoryIdsExcluding(
            @Param("categoryIds") List<Long> categoryIds,
            @Param("excludeIds") List<Long> excludeIds,
            Pageable pageable
    );

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.seasonalRelevance = :season ORDER BY p.orderCount DESC")
    List<Product> findBySeason(@Param("season") String season, Pageable pageable);

    @Query(value = "SELECT p.* FROM products p " +
                   "JOIN user_activity ua ON p.id = ua.product_id " +
                   "WHERE ua.user_id = :userId AND p.active = true " +
                   "GROUP BY p.id ORDER BY COUNT(ua.id) DESC",
           nativeQuery = true)
    List<Product> findByUserHistory(@Param("userId") Long userId, Pageable pageable);

    // ── Search ──────────────────────────────────────────────────────────────
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> searchProducts(@Param("q") String query, Pageable pageable);

    // ── Stats ────────────────────────────────────────────────────────────────
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.orderCount = p.orderCount + 1 WHERE p.id = :id")
    void incrementOrderCount(@Param("id") Long id);
}
