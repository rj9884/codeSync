package com.codesync.controller;

import com.codesync.dto.ExecutionRequest;
import com.codesync.dto.ExecutionResponse;
import com.codesync.service.CodeExecutionService;
import com.codesync.util.LanguageMapper;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/execute")
@RequiredArgsConstructor
@Slf4j
public class ExecutionController {

    private final CodeExecutionService codeExecutionService;
    private final LanguageMapper languageMapper;
    private final Map<String, Bucket> rateLimitBuckets = new ConcurrentHashMap<>();

    @PostMapping
    public ResponseEntity<ExecutionResponse> executeCode(@Valid @RequestBody ExecutionRequest request) {
        String clientIp = "default"; // In production, extract from request
        Bucket bucket = rateLimitBuckets.computeIfAbsent(clientIp, k -> createRateLimitBucket());

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .header("X-Rate-Limit-Remaining", "0")
                    .header("X-Rate-Limit-Reset", String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000))
                    .build();
        }

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

        return ResponseEntity.ok()
                .header("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()))
                .body(response);
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

    private Bucket createRateLimitBucket() {
        return Bucket.builder()
                .addLimit(limit -> limit.capacity(10).refillGreedy(10, Duration.ofMinutes(1)))
                .build();
    }
}