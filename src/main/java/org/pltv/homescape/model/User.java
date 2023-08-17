package org.pltv.homescape.model;

import jakarta.persistence.Id;
import jakarta.validation.Constraint;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private Long id;
    private String name;
    @Email(message = "Email is not valid")
    private String email;
    private String password;
    private String phone;
    private String address;
}
