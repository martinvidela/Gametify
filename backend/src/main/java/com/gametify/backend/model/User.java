package com.gametify.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String profilePicture;
    private String bannerUrl;

    @Column(length = 500)
    private String bio;

    private String country;

    @Builder.Default
    @ManyToMany
    @JoinTable(name = "user_follows", joinColumns = @JoinColumn(name = "follower_id"), inverseJoinColumns = @JoinColumn(name = "following_id"))
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "following", "followers", "password" })
    private Set<User> following = new HashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "following")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "following", "followers", "password" })
    private Set<User> followers = new HashSet<>();

    @jakarta.persistence.Column(insertable = false, updatable = false)
    @org.hibernate.annotations.Formula("(SELECT COUNT(*) FROM reviews r WHERE r.user_id = id)")
    private Integer reviewCount;
}
