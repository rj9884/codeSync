package com.codesync.controller;

import com.codesync.model.Room;
import com.codesync.service.RoomService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoomController.class)
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoomService roomService;

    @Test
    @DisplayName("GET /rooms/{roomId} should return room if exists")
    void shouldReturnRoomIfExists() throws Exception {
        Room room = new Room("room-123", "code", "javascript");
        when(roomService.getRoom("room-123")).thenReturn(room);

        mockMvc.perform(get("/rooms/room-123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("room-123"))
                .andExpect(jsonPath("$.language").value("javascript"));
    }

    @Test
    @DisplayName("GET /rooms/{roomId} should return 404 if not found")
    void shouldReturnNotFound() throws Exception {
        when(roomService.getRoom("missing-room")).thenReturn(null);

        mockMvc.perform(get("/rooms/missing-room"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /rooms should create a room")
    void shouldCreateRoom() throws Exception {
        Room room = new Room("my-custom-room", "console.log('hi')", "javascript");
        when(roomService.getRoom("my-custom-room")).thenReturn(null);
        when(roomService.createRoom(anyString(), anyString(), anyString())).thenReturn(room);

        mockMvc.perform(post("/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"roomId\": \"my-custom-room\", \"language\": \"javascript\", \"initialCode\": \"console.log('hi')\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("my-custom-room"));
    }
}
