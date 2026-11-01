package com.codesync.util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class LanguageMapper {

    private static final Map<String, Integer> LANGUAGE_IDS = new HashMap<>();

    static {
        LANGUAGE_IDS.put("java", 91);
        LANGUAGE_IDS.put("python", 71);
        LANGUAGE_IDS.put("cpp", 54);
        LANGUAGE_IDS.put("c", 50);
        LANGUAGE_IDS.put("javascript", 63);
        LANGUAGE_IDS.put("typescript", 74);
        LANGUAGE_IDS.put("html", 72);
        LANGUAGE_IDS.put("css", 73);
        LANGUAGE_IDS.put("go", 60);
        LANGUAGE_IDS.put("rust", 73);
        LANGUAGE_IDS.put("php", 68);
        LANGUAGE_IDS.put("ruby", 72);
        LANGUAGE_IDS.put("swift", 83);
        LANGUAGE_IDS.put("kotlin", 78);
        LANGUAGE_IDS.put("scala", 81);
    }

    public int getLanguageId(String language) {
        return LANGUAGE_IDS.getOrDefault(language.toLowerCase(), 63);
    }

    public String getLanguageName(int languageId) {
        for (Map.Entry<String, Integer> entry : LANGUAGE_IDS.entrySet()) {
            if (entry.getValue().equals(languageId)) {
                return entry.getKey();
            }
        }
        return "javascript";
    }

    public boolean isSupported(String language) {
        return LANGUAGE_IDS.containsKey(language.toLowerCase());
    }
}