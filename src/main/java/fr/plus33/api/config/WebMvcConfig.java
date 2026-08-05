package fr.plus33.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration

public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Production: Serve from classpath static folder
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void addViewControllers(@NonNull org.springframework.web.servlet.config.annotation.ViewControllerRegistry registry) {
        // ── SPA Route Forwarding ──────────────────────────────────────
        // All known SPA routes explicitly forwarded to index.html.
        // Uses PathPatternParser-safe single-segment pattern only.
        // ──────────────────────────────────────────────────────────────

        // Explicit named routes
        registry.addViewController("/store").setViewName("forward:/index.html");
        registry.addViewController("/experience").setViewName("forward:/index.html");
        registry.addViewController("/journal").setViewName("forward:/index.html");
        registry.addViewController("/franchise").setViewName("forward:/index.html");
        registry.addViewController("/find-us").setViewName("forward:/index.html");
        registry.addViewController("/about").setViewName("forward:/index.html");
        registry.addViewController("/rewards").setViewName("forward:/index.html");

        // Single-segment catch-all: matches /anyword (but NOT /api/**, /h2-console/**, etc.)
        // Spring Boot 3 PathPatternParser does NOT allow ** followed by more segments,
        // so the old /**/{spring:\w+} pattern is replaced with the safe single-segment form.
        registry.addViewController("/{path:[a-zA-Z0-9\\-]+}")
                .setViewName("forward:/index.html");
    }
}
