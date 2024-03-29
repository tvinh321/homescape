package org.pltv.homescape.repository;

import java.util.List;
import java.util.UUID;

import org.pltv.homescape.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
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
                        "AND (:#{null eq #direction} = true OR p.direction IN :direction) ")
        Page<Property> searchProperties(
                        @Param("title") String title,
                        @Param("type") List<String> type,
                        @Param("cityId") Long cityId,
                        @Param("districtId") Long districtId,
                        @Param("ward") Long ward,
                        @Param("lowerPrice") Double lowerPrice,
                        @Param("upperPrice") Double upperPrice,
                        @Param("lowerArea") Double lowerArea,
                        @Param("upperArea") Double upperArea,
                        @Param("bedroom") List<Byte> bedroom,
                        @Param("bedroomMoreThan5") Boolean bedroomMoreThan5,
                        @Param("direction") List<String> direction,
                        Pageable pageable);

        Page<Property> findByUserId(UUID userId, PageRequest of);

        Page<Property> findByFavoriteUsersId(UUID userId, PageRequest of);
}
