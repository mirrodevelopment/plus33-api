package fr.plus33.api.repository;

import fr.plus33.api.model.Animation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimationRepository extends JpaRepository<Animation, Long> {
    List<Animation> findByActiveTrueOrderByDisplayOrderAsc();
    List<Animation> findByPageTargetAndActiveTrueOrderByDisplayOrderAsc(String pageTarget);
    List<Animation> findByAnimationTypeAndActiveTrue(Animation.AnimationType animationType);
}
