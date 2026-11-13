package com.kasi24.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record EnquiryResponse(UUID id, UUID listingId, String status, OffsetDateTime createdAt) {
}
