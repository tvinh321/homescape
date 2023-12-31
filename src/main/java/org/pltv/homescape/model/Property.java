package org.pltv.homescape.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(indexes = { @Index(name = "idx_title", columnList = "title"),
        @Index(name = "idx_price", columnList = "price"),
        @Index(name = "idx_area", columnList = "area"),
        @Index(name = "idx_created_at", columnList = "createdAt") })
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private String street;

    @Column(length = 7, nullable = false)
    @NotBlank(message = "Type is mandatory")
    private String type;

    @Positive
    @NotNull
    @Column(nullable = false)
    private Long price;

    @Positive
    @NotNull
    @Column(nullable = false)
    private Double area;

    @Column(length = 7)
    private String direction;

    @Positive
    private Byte bedroom;

    @Positive
    private Byte bathroom;

    @Positive
    private Byte floor;

    @PositiveOrZero
    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP()")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(optional = false)
    @NotNull
    private Ward ward;

    @ManyToOne(optional = false)
    @NotNull
    private User user;

    @ManyToMany
    private List<User> favoriteUsers;
}
