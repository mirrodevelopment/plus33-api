package fr.plus33.api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller to handle SPA routing.
 * Ensures that all non-API routes are handled by the index.html (frontend router).
 */
@Controller
public class NavController {

    @RequestMapping(value = {
        "/",
        "/store",
        "/experience",
        "/journal",
        "/franchise",
        "/{path:[^\\.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
