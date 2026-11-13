package com.kasi24.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "listings")
@Getter
@Setter
@NoArgsConstructor
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Supabase auth.users id of the provider who owns this listing. */
    @Column(name = "provider_id")
    private UUID providerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String area;

    /** e.g. ROOM, APARTMENT, GUESTHOUSE */
    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "max_guests")
    private Integer maxGuests;

    private BigDecimal price;

    /** e.g. "per night", "per month" - always show what the price covers. */
    @Column(name = "price_basis")
    private String priceBasis;

    /** Comma-separated for now; move to a join table when amenity filters are built. */
    private String amenities;

    @Column(name = "provider_name")
    private String providerName;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
