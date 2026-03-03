package com.gametify.backend.service;

import com.gametify.backend.model.GameList;
import com.gametify.backend.model.User;
import com.gametify.backend.repository.GameListRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameListService {

    private final GameListRepository gameListRepository;

    public GameListService(GameListRepository gameListRepository) {
        this.gameListRepository = gameListRepository;
    }

    public GameList createList(User user, String name, boolean isPrivate) {
        GameList gameList = GameList.builder()
                .user(user)
                .name(name)
                .isPrivate(isPrivate)
                .build();
        return gameListRepository.save(gameList);
    }

    public List<GameList> getUserLists(User user) {
        return gameListRepository.findByUser(user);
    }

    public GameList addGameToList(Long listId, Long gameId) {
        GameList list = gameListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("List not found"));
        if (!list.getGameIds().contains(gameId)) {
            list.getGameIds().add(gameId);
        }
        return gameListRepository.save(list);
    }

    public GameList getListById(Long id) {
        return gameListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List not found"));
    }
}
