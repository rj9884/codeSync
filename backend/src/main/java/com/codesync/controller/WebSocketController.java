package com.codesync.controller;

import com.codesync.dto.CodeUpdateRequest;
import com.codesync.dto.JoinRoomRequest;
import com.codesync.dto.TypingRequest;
import com.codesync.model.Room;
import com.codesync.model.RoomUser;
import com.codesync.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final RoomService roomService;

    @MessageMapping("/room/{roomId}/join")
    @SendTo("/topic/room/{roomId}/user-joined")
    public RoomUser joinRoom(
            @DestinationVariable String roomId,
            @Payload JoinRoomRequest request,
            SimpMessageHeaderAccessor headerAccessor) {

        String sessionId = headerAccessor.getSessionId();
        int avatarId = assignAvatarId(roomId);

        RoomUser user = new RoomUser(sessionId, request.getName(), avatarId);
        user.setOwner(!roomService.roomExists(roomId));

        Room room = roomService.joinRoom(roomId, user);
        if (room == null) {
            room = roomService.createRoom(roomId, "", "javascript");
            roomService.joinRoom(roomId, user);
        }

        // Store user info in session for cleanup
        headerAccessor.getSessionAttributes().put("roomId", roomId);
        headerAccessor.getSessionAttributes().put("userName", request.getName());
        headerAccessor.getSessionAttributes().put("sessionId", sessionId);

        log.info("User {} joined room {} with session {}", request.getName(), roomId, sessionId);
        return user;
    }

    @MessageMapping("/room/{roomId}/leave")
    @SendTo("/topic/room/{roomId}/user-left")
    public RoomUser leaveRoom(
            @DestinationVariable String roomId,
            SimpMessageHeaderAccessor headerAccessor) {

        String sessionId = headerAccessor.getSessionId();
        String userName = (String) headerAccessor.getSessionAttributes().get("userName");

        RoomUser user = new RoomUser(sessionId, userName != null ? userName : "Unknown", 1);
        roomService.leaveRoom(roomId, sessionId);

        log.info("User {} left room {}", userName, roomId);
        return user;
    }

    @MessageMapping("/room/{roomId}/code")
    @SendTo("/topic/room/{roomId}/code-update")
    public CodeUpdateRequest handleCodeChange(
            @DestinationVariable String roomId,
            @Payload CodeUpdateRequest request) {

        Room updatedRoom = roomService.updateCode(roomId, request.getCode(), request.getVersion());
        if (updatedRoom != null) {
            request.setVersion(updatedRoom.getVersion());
        }
        return request;
    }

    @MessageMapping("/room/{roomId}/typing")
    @SendTo("/topic/room/{roomId}/typing")
    public TypingRequest handleTyping(
            @DestinationVariable String roomId,
            @Payload TypingRequest request) {

        return request;
    }

    @SubscribeMapping("/room/{roomId}/state")
    public Room getRoomState(@DestinationVariable String roomId) {
        return roomService.getRoom(roomId);
    }

    private int assignAvatarId(String roomId) {
        int count = roomService.getRoomUsers(roomId).size();
        return (count % 4) + 1;
    }
}