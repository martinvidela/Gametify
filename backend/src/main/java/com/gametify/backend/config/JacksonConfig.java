package com.gametify.backend.config;

import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
        return builder -> {
            // This prevents the ByteBuddyInterceptor serialization error
            builder.featuresToDisable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        };
    }
}
