package org.pltv.homescape.dto.property;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyPost {
    private String title;
    private String street;
    private Long ward;
    private String description;
    private String type;
    private Long price;
    private Double area;
    private String direction;
    private Byte bedroom;
    private Byte bathroom;
    private Byte floor;
}
