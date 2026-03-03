package com.gametify.backend.controller;

import com.gametify.backend.service.IgdbService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:3000")
public class GameController {

    private final IgdbService igdbService;

    public GameController(IgdbService igdbService) {
        this.igdbService = igdbService;
    }

    @GetMapping("/search")
    public Mono<String> search(@RequestParam String q) {
        return igdbService.searchGames(q);
    }

    @GetMapping("/{id}")
    public Mono<String> getDetails(@PathVariable Long id) {
        return igdbService.getGameDetails(id);
    }

    @GetMapping("/trending")
    public Mono<String> getTrending() {
        return igdbService.getTrendingGames();
    }

    @GetMapping("/batch")
    public Mono<String> getBatch(@RequestParam java.util.List<Long> ids) {
        return igdbService.getGamesByIds(ids);
    }
}
