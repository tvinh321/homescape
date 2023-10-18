package org.pltv.homescape.dto.property;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertySearchQuery {
    private String title;
    private String[] type;
    private int city;
    private int district;
    private int ward;
    private double[] price;
    private double[] area;
    private byte bedroom;
    private byte bathroom;
    private byte floor;
    private String[] direction;
    private String sort;
}
