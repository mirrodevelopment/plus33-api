package fr.plus33.api.service;

import fr.plus33.api.model.Animation;
import fr.plus33.api.repository.AnimationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@SuppressWarnings("null")

public class AnimationService {

    private final AnimationRepository animationRepository;

    public List<Animation> getAll() {
        return animationRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public List<Animation> getHomepageAnimations() {
        return animationRepository.findByPageTargetAndActiveTrueOrderByDisplayOrderAsc("homepage");
    }

    public List<Animation> getByPage(String page) {
        return animationRepository.findByPageTargetAndActiveTrueOrderByDisplayOrderAsc(page);
    }

    public Animation getById(Long id) {
        return animationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animation not found: " + id));
    }

    @Transactional
    public Animation create(Animation animation) {
        return animationRepository.save(animation);
    }

    @Transactional
    public Animation update(Long id, Animation updated) {
        Animation existing = getById(id);
        existing.setName(updated.getName());
        existing.setAnimationType(updated.getAnimationType());
        existing.setDescription(updated.getDescription());
        existing.setCssClass(updated.getCssClass());
        existing.setJsTrigger(updated.getJsTrigger());
        existing.setPageTarget(updated.getPageTarget());
        existing.setElementSelector(updated.getElementSelector());
        existing.setConfigJson(updated.getConfigJson());
        existing.setDurationMs(updated.getDurationMs());
        existing.setDelayMs(updated.getDelayMs());
        existing.setEasing(updated.getEasing());
        existing.setActive(updated.getActive());
        existing.setDisplayOrder(updated.getDisplayOrder());
        return animationRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Animation a = getById(id);
        a.setActive(false);
        animationRepository.save(a);
    }
}
