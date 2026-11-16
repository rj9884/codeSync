package com.codesync.controller;

import com.codesync.dto.ExecutionRequest;
import com.codesync.dto.ExecutionResponse;
import com.codesync.service.CodeExecutionService;
import com.codesync.util.LanguageMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/execute")
@RequiredArgsConstructor
@Slf4j
public class ExecutionController {

    private final CodeExecutionService codeExecutionService;
    private final LanguageMapper languageMapper;

    @PostMapping
    public ResponseEntity<ExecutionResponse> executeCode(@Valid @RequestBody ExecutionRequest request) {
        if (!languageMapper.isSupported(request.getLanguage())) {
            return ResponseEntity.badRequest()
                    .body(ExecutionResponse.builder()
                            .output("")
                            .error("Unsupported language: " + request.getLanguage())
                            .status("Error")
                            .executionTimeMs(0)
                            .build());
        }

        log.info("Executing code in {}", request.getLanguage());
        ExecutionResponse response = codeExecutionService.executeCode(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/languages")
    public ResponseEntity<Map<String, Integer>> getSupportedLanguages() {
        return ResponseEntity.ok(Map.of(
                "java", 91,
                "python", 71,
                "cpp", 54,
                "c", 50,
                "javascript", 63,
                "typescript", 74,
                "html", 72,
                "css", 73
        ));
    }
}