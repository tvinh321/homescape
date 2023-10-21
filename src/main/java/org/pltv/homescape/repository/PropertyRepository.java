package org.pltv.homescape.repository;

import java.util.List;
import java.util.UUID;

import org.pltv.homescape.model.Property;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PropertyRepository extends JpaRepository<Property, Long> {
        List<Property> findByUserId(UUID userId);

        List<Property> findTop6ByOrderByViewCountDesc();

        @Query("SELECT p FROM Property p " +
                        "JOIN p.ward w " +
                        "JOIN w.district d " +
                        "JOIN d.city c " +
                        "WHERE (:title IS NULL OR LOWER(p.title) LIKE CONCAT('%', :title, '%')) " +
                        "AND (:#{null eq #type} = true OR p.type IN :type) " +
                        "AND (:cityId IS NULL OR c.id = :cityId) " +
                        "AND (:districtId IS NULL OR d.id = :districtId) " +
                        "AND (:ward IS NULL OR w.id = :ward) " +
                        "AND (:lowerPrice IS NULL OR p.price >= :lowerPrice) " +
                        "AND (:upperPrice IS NULL OR p.price <= :upperPrice) " +
                        "AND (:lowerArea IS NULL OR p.area >= :lowerArea) " +
                        "AND (:upperArea IS NULL OR p.area <= :upperArea) " +
                        "AND ((:#{null eq #bedroom} = true OR p.bedroom IN :bedroom) OR (:bedroomMoreThan5 IS NULL OR p.bedroom >= 5)) "
                        +
                        "AND (:#{null eq #direction} = true OR p.direction IN :direction) " +
                        "ORDER BY " +
                        "   CASE WHEN :sort = 'popular' THEN p.viewCount END DESC, " +
                        "   CASE WHEN :sort = 'newest' THEN p.createdAt END DESC, " +
                        "   CASE WHEN :sort = 'price_asc' THEN p.price END ASC, " +
                        "   CASE WHEN :sort = 'price_desc' THEN p.price END DESC, " +
                        "   CASE WHEN :sort = 'area_asc' THEN p.area END ASC, " +
                        "   CASE WHEN :sort = 'area_desc' THEN p.area END DESC")
        List<Property> searchProperties(
                        @Param("title") String title,
                        @Param("type") List<String> type,
                        @Param("cityId") Long cityId,
                        @Param("districtId") Long districtId,
                        @Param("ward") Long ward,
                        @Param("lowerPrice") Double lowerPrice,
                        @Param("upperPrice") Double upperPrice,
                        @Param("lowerArea") Double lowerArea,
                        @Param("upperArea") Double upperArea,
                        @Param("bedroom") List<String> bedroom,
                        @Param("bedroomMoreThan5") Boolean bedroomMoreThan5,
                        @Param("direction") List<String> direction,
                        @Param("sort") String sort,
                        Pageable pageable);
}
