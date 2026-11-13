package com.kasi24.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ListingResponse(
        UUID id,
        String name,
        String area,
        String type,
        String description,
        Integer maxGuests,
        BigDecimal price,
        String priceBasis,
        List<String> amenities,
        String providerName
) {
}
