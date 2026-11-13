package com.kasi24.dto.response;

import java.time.OffsetDateTime;
import java.util.Map;

public record ErrorResponse(int status, String message, Map<String, String> fieldErrors, OffsetDateTime timestamp) {
}
