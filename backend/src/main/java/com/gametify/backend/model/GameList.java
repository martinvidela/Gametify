package com.gametify.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "game_lists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User user;

    @Builder.Default
    private Boolean isPrivate = false;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "game_list_items", joinColumns = @JoinColumn(name = "list_id"))
    @Column(name = "game_id")
    private List<Long> gameIds = new ArrayList<>();
}
