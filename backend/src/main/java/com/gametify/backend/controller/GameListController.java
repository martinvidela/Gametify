package com.gametify.backend.controller;

import com.gametify.backend.model.GameList;
import com.gametify.backend.model.User;
import com.gametify.backend.repository.UserRepository;
import com.gametify.backend.service.GameListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameListController {

    private final GameListService gameListService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<GameList> createList(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody GameList listRequest) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        GameList list = gameListService.createList(user, listRequest.getName(), listRequest.getIsPrivate());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my")
    public ResponseEntity<List<GameList>> getMyLists(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(gameListService.getUserLists(user));
    }

    @PostMapping("/{listId}/games/{gameId}")
    public ResponseEntity<GameList> addGame(@PathVariable Long listId, @PathVariable Long gameId) {
        return ResponseEntity.ok(gameListService.addGameToList(listId, gameId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameList> getList(@PathVariable Long id) {
        return ResponseEntity.ok(gameListService.getListById(id));
    }
}
