package org.pltv.homescape.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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
public class District {
    @Id
    private Long id;
    private String name;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "district")
    private List<Ward> wards;

    @ManyToOne(cascade = CascadeType.ALL, optional = false)
    private City city;
}
