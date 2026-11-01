package com.codesync.service;

import com.codesync.model.Room;
import com.codesync.model.RoomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String ROOM_PREFIX = "room:";
    private static final String ROOM_USERS_PREFIX = "room:users:";

    public Room createRoom(String roomId, String initialCode, String language) {
        Room room = new Room(roomId, initialCode, language);
        redisTemplate.opsForValue().set(ROOM_PREFIX + roomId, room);
        log.info("Created room: {}", roomId);
        return room;
    }

    public Room getRoom(String roomId) {
        Room room = (Room) redisTemplate.opsForValue().get(ROOM_PREFIX + roomId);
        if (room == null) {
            return null;
        }
        // Sync users from separate hash
        Map<Object, Object> users = redisTemplate.opsForHash().entries(ROOM_USERS_PREFIX + roomId);
        if (!users.isEmpty()) {
            Map<String, RoomUser> userMap = new ConcurrentHashMap<>();
            users.forEach((k, v) -> userMap.put((String) k, (RoomUser) v));
            room.setUsers(userMap);
        }
        return room;
    }

    public boolean roomExists(String roomId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(ROOM_PREFIX + roomId));
    }

    public Room joinRoom(String roomId, RoomUser user) {
        Room room = getRoom(roomId);
        if (room == null) {
            return null;
        }
        room.addUser(user);
        redisTemplate.opsForHash().put(ROOM_USERS_PREFIX + roomId, user.getSessionId(), user);
        redisTemplate.opsForValue().set(ROOM_PREFIX + roomId, room);
        log.info("User {} joined room {}", user.getName(), roomId);
        return room;
    }

    public void leaveRoom(String roomId, String sessionId) {
        Room room = getRoom(roomId);
        if (room != null) {
            room.removeUser(sessionId);
            redisTemplate.opsForHash().delete(ROOM_USERS_PREFIX + roomId, sessionId);
            redisTemplate.opsForValue().set(ROOM_PREFIX + roomId, room);
            log.info("User {} left room {}", sessionId, roomId);

            // Clean up empty rooms after delay
            if (room.getUserCount() == 0) {
                scheduleRoomCleanup(roomId);
            }
        }
    }

    private void scheduleRoomCleanup(String roomId) {
        // In production, use a scheduled task or TTL
        // For now, rely on Redis TTL
    }

    public Room updateCode(String roomId, String code, long version) {
        Room room = getRoom(roomId);
        if (room == null) {
            return null;
        }
        // Simple optimistic locking
        if (version > 0 && version != room.getVersion()) {
            log.warn("Version conflict for room {}: expected {}, got {}", roomId, room.getVersion(), version);
            return null;
        }
        room.setCode(code);
        room.setVersion(room.getVersion() + 1);
        room.setUpdatedAt(Instant.now());
        redisTemplate.opsForValue().set(ROOM_PREFIX + roomId, room);
        return room;
    }

    public List<RoomUser> getRoomUsers(String roomId) {
        Map<Object, Object> users = redisTemplate.opsForHash().entries(ROOM_USERS_PREFIX + roomId);
        return users.values().stream()
                .map(v -> (RoomUser) v)
                .toList();
    }

    public void deleteRoom(String roomId) {
        redisTemplate.delete(ROOM_PREFIX + roomId);
        redisTemplate.delete(ROOM_USERS_PREFIX + roomId);
        log.info("Deleted room: {}", roomId);
    }

    public Collection<Room> getAllRooms() {
        Set<String> keys = redisTemplate.keys(ROOM_PREFIX + "*");
        if (keys == null || keys.isEmpty()) {
            return Collections.emptyList();
        }
        return redisTemplate.opsForValue().multiGet(keys).stream()
                .map(o -> (Room) o)
                .toList();
    }
}