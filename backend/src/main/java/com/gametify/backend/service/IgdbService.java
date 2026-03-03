package com.gametify.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class IgdbService {

    private final WebClient webClient;

    @Value("${igdb.client-id:}")
    private String clientId;

    @Value("${igdb.access-token:}")
    private String accessToken;

    public IgdbService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.igdb.com/v4").build();
    }

    public Mono<String> searchGames(String query) {
        if (clientId == null || clientId.isEmpty() || clientId.equals("YOUR_CLIENT_ID")) {
            return Mono.just("[{\"id\":1, \"name\":\"" + query
                    + " (Demo Mode)\", \"cover\":{\"url\":\"//images.igdb.com/igdb/image/upload/t_thumb/co4p98.jpg\"}, \"total_rating\":95, \"first_release_date\":1645747200}]");
        }

        // search keyword is better for matching user intent
        String body = "search \"" + query + "\"; fields name, cover.url, first_release_date, total_rating; limit 24;";
        // ... (rest of the method remains the same but I'll update it for safety)
        return callIgdb("/games", body);
    }

    public Mono<String> getGameDetails(Long gameId) {
        if (clientId == null || clientId.isEmpty() || clientId.equals("YOUR_CLIENT_ID")) {
            return Mono.just("[{\"id\":" + gameId
                    + ", \"name\":\"Sample Game\", \"summary\":\"This is a sample summary because you are in Demo Mode. To see real data, configure an API key.\", \"cover\":{\"url\":\"//images.igdb.com/igdb/image/upload/t_thumb/co4p98.jpg\"}, \"total_rating\":90, \"genres\":[{\"name\":\"Action\"}], \"platforms\":[{\"name\":\"PC\"}]}]");
        }

        String body = "fields name, summary, cover.url, first_release_date, total_rating, genres.name, platforms.name; where id = "
                + gameId + ";";

        return callIgdb("/games", body);
    }

    public Mono<String> getTrendingGames() {
        if (clientId == null || clientId.isEmpty() || clientId.equals("YOUR_CLIENT_ID")) {
            // Return some hardcoded famous games for the home page
            return Mono.just("[" +
                    "{\"id\":1, \"name\":\"Elden Ring\", \"cover\":{\"url\":\"//images.igdb.com/igdb/image/upload/t_thumb/co4p98.jpg\"}, \"total_rating\":96, \"first_release_date\":1645747200},"
                    +
                    "{\"id\":2, \"name\":\"The Last of Us Part II\", \"cover\":{\"url\":\"//images.igdb.com/igdb/image/upload/t_thumb/co2itj.jpg\"}, \"total_rating\":94, \"first_release_date\":1592524800},"
                    +
                    "{\"id\":3, \"name\":\"Cyberpunk 2077\", \"cover\":{\"url\":\"//images.igdb.com/igdb/image/upload/t_thumb/co2mdf.jpg\"}, \"total_rating\":85, \"first_release_date\":1607558400}"
                    +
                    "]");
        }

        // Fetching games with high rating and recent release or just popular ones
        String body = "fields name, cover.url, first_release_date, total_rating; " +
                "where total_rating > 80 & first_release_date > 1577836800; " +
                "sort total_rating desc; " +
                "limit 24;";

        return callIgdb("/games", body);
    }

    public Mono<String> getGamesByIds(java.util.List<Long> gameIds) {
        if (gameIds == null || gameIds.isEmpty())
            return Mono.just("[]");
        if (clientId == null || clientId.isEmpty() || clientId.equals("YOUR_CLIENT_ID")) {
            return Mono.just("[]");
        }

        String idsString = gameIds.stream().map(String::valueOf).collect(java.util.stream.Collectors.joining(","));
        String body = "fields name, cover.url, first_release_date, total_rating; where id = (" + idsString
                + "); limit 500;";

        return callIgdb("/games", body);
    }

    private Mono<String> callIgdb(String path, String body) {
        return webClient.post()
                .uri(path)
                .header("Client-ID", clientId)
                .header("Authorization", "Bearer " + accessToken)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorResume(e -> {
                    System.err.println("IGDB API Error: " + e.getMessage());
                    return Mono.just("[]");
                });
    }
}
