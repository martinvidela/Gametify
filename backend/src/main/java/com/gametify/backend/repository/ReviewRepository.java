package com.gametify.backend.repository;

import com.gametify.backend.model.Review;
import com.gametify.backend.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = { "user" })
    List<Review> findByGameId(Long gameId);

    @EntityGraph(attributePaths = { "user" })
    List<Review> findByUser(User user);

    @EntityGraph(attributePaths = { "user" })
    List<Review> findAll();

    java.util.Optional<Review> findByUserAndGameId(User user, Long gameId);
}
