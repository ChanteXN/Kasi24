package com.kasi24.repository;

import com.kasi24.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {

    List<Listing> findByAreaContainingIgnoreCase(String area);
}
