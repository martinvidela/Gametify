package com.gametify.backend.service;

import com.gametify.backend.model.Review;
import com.gametify.backend.model.User;
import com.gametify.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review createReview(User user, Long gameId, String gameName, String gameCoverUrl, Double rating,
            String content) {
        Review review = Review.builder()
                .user(user)
                .gameId(gameId)
                .gameName(gameName)
                .gameCoverUrl(gameCoverUrl)
                .rating(rating)
                .content(content)
                .build();
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByGame(Long gameId) {
        return reviewRepository.findByGameId(gameId);
    }

    public List<Review> getReviewsByUser(User user) {
        return reviewRepository.findByUser(user);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public java.util.Optional<Review> getReviewByUserAndGame(User user, Long gameId) {
        return reviewRepository.findByUserAndGameId(user, gameId);
    }

    public Review updateReview(Review review, Double rating, String content) {
        review.setRating(rating);
        review.setContent(content);
        return reviewRepository.save(review);
    }
}
