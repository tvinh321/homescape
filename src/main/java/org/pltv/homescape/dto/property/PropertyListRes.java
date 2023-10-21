package org.pltv.homescape.dto.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyListRes {
    private Long id;
    private String title;
    private Long price;
    private Double area;
    private String createdAt;
    private String location;
    private String image;
    private Boolean favorite;
}