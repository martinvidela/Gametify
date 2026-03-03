package com.gametify.backend;

import com.gametify.backend.model.User;
import com.gametify.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class GametifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(GametifyApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByUsername("testuser").isEmpty()) {
				User user = User.builder()
						.username("testuser")
						.email("test@gametify.com")
						.password(passwordEncoder.encode("password123"))
						.bio("I am a test user for Gametify!")
						.profilePicture("https://api.dicebear.com/7.x/avataaars/svg?seed=testuser")
						.build();
				userRepository.save(user);
				System.out.println("Seed user created: testuser / password123");
			}
		};
	}
}
