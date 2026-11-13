package com.kasi24.repository;

import com.kasi24.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EnquiryRepository extends JpaRepository<Enquiry, UUID> {
}
