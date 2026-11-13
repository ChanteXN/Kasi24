package com.kasi24.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record EnquiryRequest(
        @NotNull UUID listingId,
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email String email,
        @Size(max = 30) String phone,
        LocalDate checkIn,
        LocalDate checkOut,
        @Min(1) Integer guests,
        @NotBlank @Size(max = 2000) String message,
        @AssertTrue(message = "Consent is required to share your details with the provider") boolean consent
) {
}
