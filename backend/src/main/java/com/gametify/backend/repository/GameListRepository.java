package com.gametify.backend.repository;

import com.gametify.backend.model.GameList;
import com.gametify.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameListRepository extends JpaRepository<GameList, Long> {
    List<GameList> findByUser(User user);
}
