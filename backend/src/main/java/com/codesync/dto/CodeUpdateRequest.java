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
public class CodeUpdateRequest {

    @NotBlank(message = "Room ID is required")
    private String roomId;

    private String code;

    private long version;
}