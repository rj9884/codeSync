package com.codesync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomRequest {

    @NotBlank(message = "Room ID is required")
    @Size(max = 100, message = "Room ID too long")
    private String roomId;

    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 50, message = "Name must be 1-50 characters")
    private String name;
}