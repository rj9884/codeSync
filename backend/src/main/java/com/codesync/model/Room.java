package com.codesync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("Room")
public class Room {

    @Id
    private String id;

    private String code;

    private String language;

    private long version;

    private Instant createdAt;

    private Instant updatedAt;

    @JsonIgnore
    @Builder.Default
    private Map<String, RoomUser> users = new ConcurrentHashMap<>();

    @TimeToLive
    private Long ttlSeconds;

    public Room(String id, String code, String language) {
        this.id = id;
        this.code = code;
        this.language = language;
        this.version = 0L;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.users = new ConcurrentHashMap<>();
        this.ttlSeconds = 86400L; // 24 hours
    }

    public void addUser(RoomUser user) {
        users.put(user.getSessionId(), user);
        this.updatedAt = Instant.now();
    }

    public void removeUser(String sessionId) {
        users.remove(sessionId);
        this.updatedAt = Instant.now();
    }

    public boolean hasUser(String sessionId) {
        return users.containsKey(sessionId);
    }

    public int getUserCount() {
        return users.size();
    }
}