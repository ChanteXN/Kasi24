package com.kasi24.service;

import com.kasi24.dto.request.EnquiryRequest;
import com.kasi24.dto.response.EnquiryResponse;

public interface EnquiryService {

    EnquiryResponse create(EnquiryRequest request);
}
