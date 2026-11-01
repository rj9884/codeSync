package com.codesync.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomUser {

    private String sessionId;
    private String name;
    private int avatarId;
    private Instant joinedAt;
    private boolean isOwner;

    public RoomUser(String sessionId, String name, int avatarId) {
        this.sessionId = sessionId;
        this.name = name;
        this.avatarId = avatarId;
        this.joinedAt = Instant.now();
        this.isOwner = false;
    }
}