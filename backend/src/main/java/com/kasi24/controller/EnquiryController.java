package com.kasi24.controller;

import com.kasi24.dto.request.EnquiryRequest;
import com.kasi24.dto.response.EnquiryResponse;
import com.kasi24.service.EnquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** UC-04: contact a provider about a listing. */
@RestController
@RequestMapping("/api/enquiries")
@RequiredArgsConstructor
public class EnquiryController {

    private final EnquiryService enquiryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnquiryResponse create(@Valid @RequestBody EnquiryRequest request) {
        return enquiryService.create(request);
    }
}
