package com.codesync.service;

import com.codesync.model.Room;
import com.codesync.model.RoomUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @Mock
    private HashOperations<String, Object, Object> hashOperations;

    private ObjectMapper objectMapper;
    private RoomService roomService;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        roomService = new RoomService(redisTemplate, objectMapper);
    }

    @Test
    @DisplayName("Should create room and persist to Redis")
    void shouldCreateRoom() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        Room room = roomService.createRoom("test-room", "console.log('hello');", "javascript");

        assertNotNull(room);
        assertEquals("test-room", room.getId());
        assertEquals("javascript", room.getLanguage());
        assertEquals("console.log('hello');", room.getCode());
        verify(valueOperations).set(eq("room:test-room"), any(Room.class));
    }

    @Test
    @DisplayName("Should retrieve room from Redis")
    void shouldGetRoom() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.opsForHash()).thenReturn(hashOperations);

        Room mockRoom = new Room("test-room", "console.log(1)", "javascript");
        when(valueOperations.get("room:test-room")).thenReturn(mockRoom);
        when(hashOperations.entries("room:users:test-room")).thenReturn(Collections.emptyMap());

        Room retrieved = roomService.getRoom("test-room");

        assertNotNull(retrieved);
        assertEquals("test-room", retrieved.getId());
    }

    @Test
    @DisplayName("Should return null when room not found")
    void shouldReturnNullWhenNotFound() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("room:nonexistent")).thenReturn(null);

        Room retrieved = roomService.getRoom("nonexistent");
        assertNull(retrieved);
    }

    @Test
    @DisplayName("Should update code in room")
    void shouldUpdateCode() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.opsForHash()).thenReturn(hashOperations);

        Room mockRoom = new Room("test-room", "initial", "javascript");
        when(valueOperations.get("room:test-room")).thenReturn(mockRoom);
        when(hashOperations.entries("room:users:test-room")).thenReturn(Collections.emptyMap());

        Room updated = roomService.updateCode("test-room", "updated code", 2);

        assertNotNull(updated);
        assertEquals("updated code", updated.getCode());
        assertTrue(updated.getVersion() >= 2);
    }

    @Test
    @DisplayName("Should update language in room")
    void shouldUpdateLanguage() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(redisTemplate.opsForHash()).thenReturn(hashOperations);

        Room mockRoom = new Room("test-room", "initial", "javascript");
        when(valueOperations.get("room:test-room")).thenReturn(mockRoom);
        when(hashOperations.entries("room:users:test-room")).thenReturn(Collections.emptyMap());

        Room updated = roomService.updateLanguage("test-room", "python");

        assertNotNull(updated);
        assertEquals("python", updated.getLanguage());
    }
}
