package com.kasi24.service.impl;

import com.kasi24.dto.request.EnquiryRequest;
import com.kasi24.dto.response.EnquiryResponse;
import com.kasi24.entity.Enquiry;
import com.kasi24.exception.BadRequestException;
import com.kasi24.exception.ResourceNotFoundException;
import com.kasi24.repository.EnquiryRepository;
import com.kasi24.repository.ListingRepository;
import com.kasi24.service.EnquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnquiryServiceImpl implements EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final ListingRepository listingRepository;

    @Override
    @Transactional
    public EnquiryResponse create(EnquiryRequest request) {
        if (request.checkIn() != null && request.checkOut() != null
                && !request.checkOut().isAfter(request.checkIn())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        var listing = listingRepository.findById(request.listingId())
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found: " + request.listingId()));

        var enquiry = new Enquiry();
        enquiry.setListing(listing);
        enquiry.setName(request.name());
        enquiry.setEmail(request.email());
        enquiry.setPhone(request.phone());
        enquiry.setCheckIn(request.checkIn());
        enquiry.setCheckOut(request.checkOut());
        enquiry.setGuests(request.guests());
        enquiry.setMessage(request.message());
        enquiry.setConsent(request.consent());

        var saved = enquiryRepository.save(enquiry);
        return new EnquiryResponse(saved.getId(), listing.getId(), saved.getStatus().name(), saved.getCreatedAt());
    }
}
