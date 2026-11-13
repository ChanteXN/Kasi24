package com.kasi24.service.impl;

import com.kasi24.dto.response.ListingResponse;
import com.kasi24.exception.ResourceNotFoundException;
import com.kasi24.mapper.ListingMapper;
import com.kasi24.repository.ListingRepository;
import com.kasi24.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepository;

    @Override
    public List<ListingResponse> search(String area) {
        var listings = StringUtils.hasText(area)
                ? listingRepository.findByAreaContainingIgnoreCase(area.trim())
                : listingRepository.findAll();
        return listings.stream().map(ListingMapper::toResponse).toList();
    }

    @Override
    public ListingResponse getById(UUID id) {
        return listingRepository.findById(id)
                .map(ListingMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found: " + id));
    }
}
