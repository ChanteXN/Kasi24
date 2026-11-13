package com.kasi24.controller;

import com.kasi24.dto.response.ListingResponse;
import com.kasi24.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/** UC-01 / UC-02: search for and inspect accommodation. */
@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping
    public List<ListingResponse> search(@RequestParam(required = false) String area) {
        return listingService.search(area);
    }

    @GetMapping("/{id}")
    public ListingResponse getById(@PathVariable UUID id) {
        return listingService.getById(id);
    }
}
