package com.codesync.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LanguageMapperTest {

    private LanguageMapper languageMapper;

    @BeforeEach
    void setUp() {
        languageMapper = new LanguageMapper();
    }

    @Test
    @DisplayName("Should return correct Judge0 ID for supported languages")
    void shouldReturnCorrectIdForSupportedLanguages() {
        assertEquals(91, languageMapper.getLanguageId("java"));
        assertEquals(71, languageMapper.getLanguageId("python"));
        assertEquals(63, languageMapper.getLanguageId("javascript"));
        assertEquals(74, languageMapper.getLanguageId("typescript"));
        assertEquals(54, languageMapper.getLanguageId("cpp"));
        assertEquals(50, languageMapper.getLanguageId("c"));
        assertEquals(72, languageMapper.getLanguageId("html"));
        assertEquals(73, languageMapper.getLanguageId("css"));
    }

    @Test
    @DisplayName("Should be case insensitive when looking up language ID")
    void shouldBeCaseInsensitive() {
        assertEquals(91, languageMapper.getLanguageId("JAVA"));
        assertEquals(71, languageMapper.getLanguageId("Python"));
        assertEquals(63, languageMapper.getLanguageId("JavaScript"));
    }

    @Test
    @DisplayName("Should return default ID (63 for JavaScript) for unknown language")
    void shouldReturnDefaultIdForUnknownLanguage() {
        assertEquals(63, languageMapper.getLanguageId("unknown-lang"));
    }

    @Test
    @DisplayName("Should return language name for valid language ID")
    void shouldReturnLanguageNameForValidId() {
        assertEquals("java", languageMapper.getLanguageName(91));
        assertEquals("python", languageMapper.getLanguageName(71));
        assertEquals("javascript", languageMapper.getLanguageName(63));
    }

    @Test
    @DisplayName("Should return default name for unknown language ID")
    void shouldReturnDefaultNameForUnknownId() {
        assertEquals("javascript", languageMapper.getLanguageName(9999));
    }

    @Test
    @DisplayName("Should check if language is supported")
    void shouldCheckSupportedLanguages() {
        assertTrue(languageMapper.isSupported("java"));
        assertTrue(languageMapper.isSupported("PYTHON"));
        assertFalse(languageMapper.isSupported("brainfuck"));
    }
}
