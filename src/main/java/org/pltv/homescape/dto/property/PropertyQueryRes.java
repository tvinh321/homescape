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
public class PropertyQueryRes {
    private List<PropertyListRes> properties;
    private Integer totalPages;
}
