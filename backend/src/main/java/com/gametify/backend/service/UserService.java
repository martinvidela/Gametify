package com.gametify.backend.service;

import com.gametify.backend.model.User;
import com.gametify.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void followUser(User follower, User toFollow) {
        if (follower.getId().equals(toFollow.getId()))
            return;
        follower.getFollowing().add(toFollow);
        userRepository.save(follower);
    }

    @Transactional
    public void unfollowUser(User follower, User toUnfollow) {
        follower.getFollowing().remove(toUnfollow);
        userRepository.save(follower);
    }

    public User updateProfile(User user, String bio, String profilePicture, String bannerUrl, String country) {
        if (bio != null)
            user.setBio(bio);
        if (profilePicture != null)
            user.setProfilePicture(profilePicture);
        if (bannerUrl != null)
            user.setBannerUrl(bannerUrl);
        if (country != null)
            user.setCountry(country);
        return userRepository.save(user);
    }

    public void changePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
