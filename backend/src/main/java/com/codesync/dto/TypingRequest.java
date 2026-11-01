package com.codesync.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingRequest {

    @NotBlank(message = "Room ID is required")
    private String roomId;

    @NotBlank(message = "User name is required")
    private String name;

    private boolean typing;
}