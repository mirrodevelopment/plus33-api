package fr.plus33.api.controller;

import org.springframework.stereotype.Controller;

/**
 * SPA routing controller.
 * Route forwarding is configured cleanly in fr.plus33.api.config.WebMvcConfig
 * via ViewControllerRegistry to adhere to Spring Boot 3 PathPatternParser standards.
 */
@Controller
public class NavController {
    // Route forwards are managed in WebMvcConfig.addViewControllers
}

