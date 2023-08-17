package org.pltv.homescape.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class City {
    @Id
    private Long id;
    private String name;

    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL)
    private List<District> districts;
}
