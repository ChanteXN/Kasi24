package com.kasi24.service;

import com.kasi24.dto.response.ListingResponse;

import java.util.List;
import java.util.UUID;

public interface ListingService {

    List<ListingResponse> search(String area);

    ListingResponse getById(UUID id);
}
