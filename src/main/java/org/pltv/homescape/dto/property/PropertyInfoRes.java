package org.pltv.homescape.dto.property;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyInfoRes {
    private Long id;
    private String title;
    private String description;
    private String type;
    private Long price;
    private Double area;
    private String direction;
    private Byte bedroom;
    private Byte bathroom;
    private Byte floor;
    private String createdAt;
    private String location;
    private List<PropertyFileRes> files;
    private PropertyAuthorRes author;
    private Boolean favorite;
}
