package com.kasi24.mapper;

import com.kasi24.dto.response.ListingResponse;
import com.kasi24.entity.Listing;
import com.kasi24.util.StringListUtils;

public final class ListingMapper {

    private ListingMapper() {
    }

    public static ListingResponse toResponse(Listing listing) {
        return new ListingResponse(
                listing.getId(),
                listing.getName(),
                listing.getArea(),
                listing.getType(),
                listing.getDescription(),
                listing.getMaxGuests(),
                listing.getPrice(),
                listing.getPriceBasis(),
                StringListUtils.fromCsv(listing.getAmenities()),
                listing.getProviderName()
        );
    }
}
