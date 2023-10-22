package org.pltv.homescape.model;

import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Column(nullable = false, columnDefinition = "VARCHAR(64) DEFAULT 'default.webp'")
    @Builder.Default
    private String avatar = "default.webp";
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Name is not valid")
    @Column(length = 32)
    private String name;
    @Email(message = "Email is not valid")
    @Column(unique = true, nullable = false)
    private String email;
    @Column(length = 60, nullable = false)
    private String password;
    @Pattern(regexp = "^$|^[0-9]+$", message = "Phone is not valid")
    private String phone;
    private String street;

    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private Byte status;

    @ManyToOne(optional = true, cascade = CascadeType.ALL)
    private Ward ward;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Property> properties;

    @ManyToMany(mappedBy = "favoriteUsers", cascade = CascadeType.ALL)
    private List<Property> favoriteProperties;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(() -> "ROLE_USER");
    }

    @Override
    public String getUsername() {
        return this.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
