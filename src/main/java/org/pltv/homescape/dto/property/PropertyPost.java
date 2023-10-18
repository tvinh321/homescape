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
    private int ward;
    private String description;
    private String type;
    private double price;
    private double area;
    private String direction;
    private byte bedroom;
    private byte bathroom;
    private byte floor;
}
