package com.gametify.backend.controller;

import com.gametify.backend.model.Review;
import com.gametify.backend.model.User;
import com.gametify.backend.repository.UserRepository;
import com.gametify.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

        private final ReviewService reviewService;
        private final UserRepository userRepository;

        @PostMapping
        public ResponseEntity<Review> createReview(@AuthenticationPrincipal UserDetails userDetails,
                        @RequestBody Review reviewRequest) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Review review = reviewService.createReview(user, reviewRequest.getGameId(), reviewRequest.getGameName(),
                                reviewRequest.getGameCoverUrl(), reviewRequest.getRating(), reviewRequest.getContent());
                return ResponseEntity.ok(review);
        }

        @GetMapping("/game/{gameId}")
        public ResponseEntity<List<Review>> getReviewsByGame(@PathVariable Long gameId) {
                return ResponseEntity.ok(reviewService.getReviewsByGame(gameId));
        }

        @GetMapping("/user/{username}")
        public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return ResponseEntity.ok(reviewService.getReviewsByUser(user));
        }

        @GetMapping
        public ResponseEntity<List<Review>> getAllReviews() {
                return ResponseEntity.ok(reviewService.getAllReviews());
        }

        @GetMapping("/my/game/{gameId}")
        public ResponseEntity<Review> getMyReviewForGame(@AuthenticationPrincipal UserDetails userDetails,
                        @PathVariable Long gameId) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return reviewService.getReviewByUserAndGame(user, gameId)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @PutMapping("/{id}")
        public ResponseEntity<Review> updateReview(@AuthenticationPrincipal UserDetails userDetails,
                        @PathVariable Long id, @RequestBody Review reviewRequest) {
                Review review = reviewService.getAllReviews().stream()
                                .filter(r -> r.getId().equals(id))
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("Review not found"));

                if (!review.getUser().getUsername().equals(userDetails.getUsername())) {
                        return ResponseEntity.status(403).build();
                }

                return ResponseEntity
                                .ok(reviewService.updateReview(review, reviewRequest.getRating(),
                                                reviewRequest.getContent()));
        }
}
