package com.codesync.controller;

import com.codesync.model.Room;
import com.codesync.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody(required = false) CreateRoomRequest request) {
        String roomId = (request != null && request.getRoomId() != null && !request.getRoomId().isBlank())
                ? request.getRoomId().trim()
                : UUID.randomUUID().toString().substring(0, 8);
        String language = request != null && request.getLanguage() != null ? request.getLanguage() : "javascript";
        String initialCode = request != null && request.getInitialCode() != null ? request.getInitialCode() : "";

        Room existing = roomService.getRoom(roomId);
        if (existing != null) {
            return ResponseEntity.ok(existing);
        }

        Room room = roomService.createRoom(roomId, initialCode, language);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Room> getRoom(@PathVariable String roomId) {
        Room room = roomService.getRoom(roomId);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String roomId) {
        if (!roomService.roomExists(roomId)) {
            return ResponseEntity.notFound().build();
        }
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    public static class CreateRoomRequest {
        private String roomId;
        private String language;
        private String initialCode;

        public String getRoomId() { return roomId; }
        public void setRoomId(String roomId) { this.roomId = roomId; }
        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }
        public String getInitialCode() { return initialCode; }
        public void setInitialCode(String initialCode) { this.initialCode = initialCode; }
    }
}