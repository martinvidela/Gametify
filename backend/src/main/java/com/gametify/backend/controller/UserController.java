package com.gametify.backend.controller;

import com.gametify.backend.model.User;
import com.gametify.backend.repository.UserRepository;
import com.gametify.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

        private final UserService userService;
        private final UserRepository userRepository;

        @GetMapping("/{username}")
        public ResponseEntity<User> getProfile(@PathVariable String username) {
                return userService.findByUsername(username)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping
        public ResponseEntity<List<User>> getAllUsers() {
                return ResponseEntity.ok(userService.getAllUsers());
        }

        @PostMapping("/follow/{username}")
        public ResponseEntity<?> follow(@AuthenticationPrincipal UserDetails userDetails,
                        @PathVariable String username) {
                User follower = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Follower not found"));
                User toFollow = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User to follow not found"));

                userService.followUser(follower, toFollow);
                return ResponseEntity.ok("Followed successfully");
        }

        @PostMapping("/unfollow/{username}")
        public ResponseEntity<?> unfollow(@AuthenticationPrincipal UserDetails userDetails,
                        @PathVariable String username) {
                User follower = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Follower not found"));
                User toUnfollow = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

                userService.unfollowUser(follower, toUnfollow);
                return ResponseEntity.ok("Unfollowed successfully");
        }

        @PutMapping("/profile")
        public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                        @RequestBody User profileData) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                User updated = userService.updateProfile(user, profileData.getBio(), profileData.getProfilePicture(),
                                profileData.getBannerUrl(), profileData.getCountry());
                return ResponseEntity.ok(updated);
        }

        @PostMapping("/change-password")
        public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                        @RequestBody String newPassword) {
                User user = userRepository.findByUsername(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                userService.changePassword(user, newPassword);
                return ResponseEntity.ok("Password changed successfully");
        }
}
