package com.codesync.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.codesync.dto.ExecutionRequest;
import com.codesync.dto.ExecutionResponse;
import com.codesync.util.LanguageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeExecutionService {

    private final LanguageMapper languageMapper;
    private final WebClient webClient;

    @Value("${judge0.api-url}")
    private String judge0ApiUrl;

    @Value("${judge0.api-key}")
    private String apiKey;

    @Value("${judge0.api-host}")
    private String apiHost;

    @Value("${judge0.timeout:10000}")
    private int timeoutMs;

    public ExecutionResponse executeCode(ExecutionRequest request) {
        long startTime = System.currentTimeMillis();
        int languageId = languageMapper.getLanguageId(request.getLanguage());

        if (apiKey == null || apiKey.trim().isEmpty()) {
            return ExecutionResponse.builder()
                    .output("")
                    .error("RapidAPI Key for Judge0 is not configured. Please set JUDGE0_API_KEY environment variable.")
                    .status("Configuration Error")
                    .executionTimeMs(0)
                    .build();
        }

        try {
            String encodedCode = Base64.getEncoder().encodeToString(request.getCode().getBytes());

            Map<String, Object> payload = Map.of(
                    "source_code", encodedCode,
                    "language_id", languageId,
                    "stdin", "",
                    "cpu_time_limit", 5,
                    "memory_limit", 256000,
                    "compiler_options", ""
            );

            String fullUrl = judge0ApiUrl.replaceAll("/+$", "") + "/submissions?base64_encoded=true&wait=true";

            Judge0Response response = webClient.post()
                    .uri(fullUrl)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header("x-rapidapi-key", apiKey)
                    .header("x-rapidapi-host", apiHost)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Judge0Response.class)
                    .timeout(Duration.ofMillis(timeoutMs))
                    .block();

            long executionTime = System.currentTimeMillis() - startTime;

            if (response == null) {
                return ExecutionResponse.builder()
                        .output("")
                        .error("No response from judge0")
                        .status("Error")
                        .executionTimeMs(executionTime)
                        .build();
            }

            return processJudge0Response(response, executionTime);

        } catch (Exception e) {
            log.error("Code execution failed", e);
            return ExecutionResponse.builder()
                    .output("")
                    .error("Execution failed: " + e.getMessage())
                    .status("Error")
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }
    }

    private ExecutionResponse processJudge0Response(Judge0Response response, long executionTime) {
        String status = response.getStatus() != null ? response.getStatus().getDescription() : "Unknown";

        // Status IDs >= 6 indicate errors (compile error, runtime error, etc.)
        if (response.getStatus() != null && response.getStatus().getId() >= 6) {
            String errorOutput = "";
            if (response.getStderr() != null) {
                errorOutput = new String(Base64.getDecoder().decode(response.getStderr()));
            } else if (response.getCompileOutput() != null) {
                errorOutput = new String(Base64.getDecoder().decode(response.getCompileOutput()));
            } else if (response.getMessage() != null) {
                errorOutput = new String(Base64.getDecoder().decode(response.getMessage()));
            }

            return ExecutionResponse.builder()
                    .output("")
                    .error(errorOutput)
                    .status(status)
                    .executionTimeMs(executionTime)
                    .build();
        }

        String output = "";
        if (response.getStdout() != null) {
            output = new String(Base64.getDecoder().decode(response.getStdout()));
        }

        return ExecutionResponse.builder()
                .output(output)
                .error("")
                .status(status)
                .executionTimeMs(executionTime)
                .build();
    }

    // Inner class for Judge0 response
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Judge0Response {
        private String stdout;
        private String stderr;
        @JsonProperty("compile_output")
        private String compile_output;
        private String message;
        private Status status;

        public String getStdout() { return stdout; }
        public void setStdout(String stdout) { this.stdout = stdout; }
        public String getStderr() { return stderr; }
        public void setStderr(String stderr) { this.stderr = stderr; }
        public String getCompileOutput() { return compile_output; }
        public void setCompileOutput(String compile_output) { this.compile_output = compile_output; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Status getStatus() { return status; }
        public void setStatus(Status status) { this.status = status; }

        public static class Status {
            private int id;
            private String description;

            public int getId() { return id; }
            public void setId(int id) { this.id = id; }
            public String getDescription() { return description; }
            public void setDescription(String description) { this.description = description; }
        }
    }
}