package fr.plus33.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

import java.nio.file.Paths;

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
        // Map SPA routes explicitly to index.html to avoid PathPatternParser errors
        registry.addViewController("/store").setViewName("forward:/index.html");
        registry.addViewController("/experience").setViewName("forward:/index.html");
        registry.addViewController("/journal").setViewName("forward:/index.html");
        registry.addViewController("/franchise").setViewName("forward:/index.html");

        // General fallback routing for single-page application paths
        registry.addViewController("/{spring:\\w+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:\\w+}")
                .setViewName("forward:/index.html");
    }
}
