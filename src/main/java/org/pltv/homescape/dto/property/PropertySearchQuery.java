package org.pltv.homescape.dto.property;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertySearchQuery {
    private String title;
    private List<String> type;
    private Long city;
    private Long district;
    private Long ward;
    private List<Double> price;
    private List<Double> area;
    private List<String> bedroom;
    private List<String> direction;
    private String sort;
}
