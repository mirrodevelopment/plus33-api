package fr.plus33.api.controller;

import fr.plus33.api.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/journal")
public class JournalController {

    @GetMapping("/stories")
    public ApiResponse<List<Map<String, Object>>> getStories() {
        return ApiResponse.ok(List.of(

            Map.of(
                "id", 1,
                "title", "The Soil of Ethiopia",
                "category", "Origins",
                "featured", true,
                "subtitle", "A dispatch from the birthplace of coffee",
                "excerpt", "Tasting coffee from Sidamo is an exercise in tracing time in high-elevation forest canopies.",
                "dateString", "May 12, 2024",
                "readTime", "8 min read",
                "imagePath", "/global/journal/assets/soil-ethiopia.png"
            ),
            Map.of(
                "id", 2,
                "title", "Altitude and Terroir: Colombia's Hidden Valleys",
                "category", "Origins",
                "featured", false,
                "subtitle", "High-altitude coffee and the farmers who grow it",
                "excerpt", "High in the Colombian Andes, extreme diurnal temperatures force cherries to concentrate sugars.",
                "dateString", "Apr 28, 2024",
                "readTime", "6 min read",
                "imagePath", "/global/journal/assets/colombia-terroir.png"
            ),
            Map.of(
                "id", 3,
                "title", "Rwanda at Dawn",
                "category", "Origins",
                "featured", false,
                "subtitle", "The quiet revolution of Rwandan specialty coffee",
                "excerpt", "Dawn over Kivu is quiet and cold, revealing steep terraced hillsides where Bourbon trees thrive.",
                "dateString", "Apr 15, 2024",
                "readTime", "5 min read",
                "imagePath", "/global/journal/assets/rwanda-dawn.png"
            ),
            Map.of(
                "id", 4,
                "title", "Roast Profiles: A Visual Atlas",
                "category", "Process",
                "featured", false,
                "subtitle", "How we listen to the bean before the roast",
                "excerpt", "Roasting is a dialogue between heat and time where a single second redefines character.",
                "dateString", "Mar 30, 2024",
                "readTime", "7 min read",
                "imagePath", "/global/journal/assets/roast-profiles.png"
            ),
            Map.of(
                "id", 5,
                "title", "Science of Extraction",
                "category", "Process",
                "featured", false,
                "subtitle", "Precision brewing and the mathematics of flavour",
                "excerpt", "To brew coffee is to govern complex chemical extraction using digital refractometers.",
                "dateString", "Mar 18, 2024",
                "readTime", "6 min read",
                "imagePath", "/global/journal/assets/science-extraction.png"
            ),
            Map.of(
                "id", 6,
                "title", "Morning in the 7ème",
                "category", "Lifestyle",
                "featured", false,
                "subtitle", "A Parisian morning through coffee",
                "excerpt", "Paris in the early morning belongs to the bakers and baristas before traffic begins.",
                "dateString", "Mar 02, 2024",
                "readTime", "4 min read",
                "imagePath", "/global/journal/assets/morning-7eme.png"
            ),
            Map.of(
                "id", 7,
                "title", "A Table in Milan",
                "category", "Lifestyle",
                "featured", false,
                "subtitle", "What Italian coffee culture taught us about brevity",
                "excerpt", "Stand at the bar of an Italian pasticceria and witness a display of speed and focus.",
                "dateString", "Feb 20, 2024",
                "readTime", "5 min read",
                "imagePath", "/global/journal/assets/milan-table.png"
            ),
            Map.of(
                "id", 8,
                "title", "The Slow Hours",
                "category", "Lifestyle",
                "featured", false,
                "subtitle", "Why the afternoon is our favourite service",
                "excerpt", "A quiet window in the afternoon when the lunch rush departs and light settles.",
                "dateString", "Feb 08, 2024",
                "readTime", "4 min read",
                "imagePath", "/global/journal/assets/slow-hours.png"
            ),
            Map.of(
                "id", 9,
                "title", "The Architecture of Taste",
                "category", "Design",
                "featured", false,
                "subtitle", "Composing spaces where coffee becomes experience",
                "excerpt", "We choose materials for tactile honesty: volcanic stone, brushed brass, oiled oak.",
                "dateString", "Jan 24, 2024",
                "readTime", "6 min read",
                "imagePath", "/global/journal/assets/architecture-taste.png"
            ),
            Map.of(
                "id", 10,
                "title", "Designing Silence: Our Dubai Atelier",
                "category", "Design",
                "featured", false,
                "subtitle", "Creating calm in the heart of Downtown Dubai",
                "excerpt", "A landscape of steel and glass where we built a sanctuary of desert travertine.",
                "dateString", "Jan 10, 2024",
                "readTime", "5 min read",
                "imagePath", "/global/journal/assets/dubai-atelier.png"
            ),
            Map.of(
                "id", 11,
                "title", "The Object: Our Ceramic Cup",
                "category", "Design",
                "featured", false,
                "subtitle", "14 months to create the perfect vessel",
                "excerpt", "The tactile connection between drinker and cup was designed with Portuguese ceramicists.",
                "dateString", "Dec 28, 2023",
                "readTime", "5 min read",
                "imagePath", "/global/journal/assets/ceramic-cup.png"
            ),
            Map.of(
                "id", 12,
                "title", "The First Pour",
                "category", "Rituals",
                "featured", false,
                "subtitle", "Understanding the bloom and what it reveals",
                "excerpt", "As hot water hits freshly ground coffee, it releases trapped carbon dioxide gas.",
                "dateString", "Dec 14, 2023",
                "readTime", "4 min read",
                "imagePath", "/global/journal/assets/first-pour.png"
            ),
            Map.of(
                "id", 13,
                "title", "Why We Never Rush",
                "category", "Rituals",
                "featured", false,
                "subtitle", "The philosophy of patience in every cup",
                "excerpt", "Patience is a radical choice. We measure efficiency by quality, not speed.",
                "dateString", "Dec 01, 2023",
                "readTime", "5 min read",
                "imagePath", "/global/journal/assets/never-rush.png"
            ),
            Map.of(
                "id", 14,
                "title", "Sunday Espresso",
                "category", "Rituals",
                "featured", false,
                "subtitle", "How Sundays change the way we brew",
                "excerpt", "Sundays have a different tempo. We adjust our grinders for a lighter, brighter body.",
                "dateString", "Nov 18, 2023",
                "readTime", "4 min read",
                "imagePath", "/global/journal/assets/sunday-espresso.png"
            )
        ));
    }
}

