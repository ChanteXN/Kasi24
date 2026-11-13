package com.kasi24.util;

import java.util.Arrays;
import java.util.List;

public final class StringListUtils {

    private StringListUtils() {
    }

    public static List<String> fromCsv(String csv) {
        if (csv == null || csv.isBlank()) {
            return List.of();
        }
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
