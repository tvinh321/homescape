package org.pltv.homescape.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.UUID;

import org.pltv.homescape.dto.property.PropertyAuthorRes;
import org.pltv.homescape.dto.property.PropertyListRes;
import org.pltv.homescape.dto.property.PropertyQueryRes;
import org.pltv.homescape.dto.user.RegisterReq;
import org.pltv.homescape.dto.user.UserInfoReq;
import org.pltv.homescape.dto.user.UserInfoRes;
import org.pltv.homescape.model.User;
import org.pltv.homescape.model.Ward;
import org.pltv.homescape.model.Property;
import org.pltv.homescape.repository.PropertyRepository;
import org.pltv.homescape.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LocationService locationService;

    @Autowired
    private FileService fileService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    @Lazy
    private PropertyService propertyService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(username);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        return user;
    }

    public User getUserByEmail(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        return user;
    }

    public void register(RegisterReq registerPost) throws Exception {
        try {
            User user = new User();
            user.setEmail(registerPost.getEmail());
            user.setPassword(passwordEncoder.encode(registerPost.getPassword()));
            user.setStatus((byte) 0);
            userRepo.save(user);

            emailService.sendVerifyEmail(user.getEmail());
        } catch (DataIntegrityViolationException e) {
            log.error("Email already exists");
            throw new Exception("Email already exists");
        } catch (Exception e) {
            log.error("Error when registering");
            throw new Exception("Error when registering");
        }
    }

    public void verifyEmail(String token) throws Exception {
        Boolean verification = emailService.verifyEmailToken(token, false);
        if (verification == false) {
            log.error("Token is invalid");
            throw new Exception("Token is invalid");
        }

        String email = emailService.getEmailFromToken(token);
        if (email == null) {
            log.error("Token is invalid");
            throw new Exception("Token is invalid");
        }

        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        user.setStatus((byte) 1);
        userRepo.save(user);

        emailService.deleteEmailToken(token);
    }

    public boolean checkUserVerified(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        return user.getStatus() == 1;
    }

    public void forgotPassword(String email) throws Exception {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new Exception("User not found");
        }

        emailService.sendResetEmail(user.getEmail());
    }

    public void resetPassword(String token, String newPassword) throws Exception {
        Boolean verification = emailService.verifyEmailToken(token, true);
        if (verification == false) {
            log.error("Token is invalid");
            throw new Exception("Token is invalid");
        }

        String email = emailService.getEmailFromToken(token);
        if (email == null) {
            log.error("Token is invalid");
            throw new Exception("Token is invalid");
        }

        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        emailService.deleteEmailToken(token);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepo.save(user);
        } else {
            log.error("Old password is incorrect");
            throw new IllegalArgumentException("Old password is incorrect");
        }
    }

    public UserInfoReq getUserInfo(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        UserInfoReq userInfo = new UserInfoReq();
        userInfo.setId(user.getId());
        userInfo.setAvatar(user.getAvatar());
        userInfo.setEmail(user.getEmail());
        userInfo.setName(user.getName());
        userInfo.setPhone(user.getPhone());
        userInfo.setStreet(user.getStreet());
        userInfo.setWard(user.getWard() == null ? null : user.getWard().getId());
        userInfo.setDistrict(user.getWard() == null ? null : user.getWard().getDistrict().getId());
        userInfo.setCity(user.getWard() == null ? null : user.getWard().getDistrict().getCity().getId());
        return userInfo;
    }

    public UserInfoRes updateUserInfo(UserInfoReq info, String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        user.setName(info.getName());
        user.setPhone(info.getPhone());
        user.setStreet(info.getStreet());

        Ward ward = locationService.getWardFromId(info.getWard());
        if (ward == null) {
            log.error("Ward not found");
            throw new IllegalArgumentException("Ward not found");
        }
        user.setWard(ward);

        userRepo.save(user);

        return UserInfoRes.builder()
                .name(user.getName())
                .phone(user.getPhone())
                .street(user.getStreet())
                .ward(user.getWard().getId())
                .district(user.getWard().getDistrict().getId())
                .city(user.getWard().getDistrict().getCity().getId())
                .build();
    }

    public PropertyQueryRes getProperties(String email, int page) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        PropertyQueryRes properties = propertyService.getPropertiesByEmail(email, page);
        return properties;
    }

    public PropertyQueryRes getFavoritesProperties(String email, int page) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        PropertyQueryRes properties = propertyService.getFavoritePropertiesByEmail(email, page);
        return properties;
    }

    public void addToFavorite(String email, Long propertyId) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        Property property = propertyService.getProperty(propertyId);
        if (property == null) {
            log.error("Property not found");
            throw new IllegalArgumentException("Property not found");
        }

        user.getFavoriteProperties().add(property);
        property.getFavoriteUsers().add(user);

        userRepo.save(user);
        propertyService.saveProperty(property);
    }

    public void removeFromFavorite(String email, Long propertyId) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        Property property = propertyService.getProperty(propertyId);
        if (property == null) {
            log.error("Property not found");
            throw new IllegalArgumentException("Property not found");
        }

        user.getFavoriteProperties().remove(property);
        property.getFavoriteUsers().remove(user);

        userRepo.save(user);
        propertyService.saveProperty(property);
    }

    public PropertyAuthorRes changeToPropertyAuthorRes(User user) {
        return PropertyAuthorRes.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .build();
    }

    public ByteArrayResource getAvatar(String fileName) throws IOException {
        // File file = new File("avatars/" + fileName);

        // if (file.exists()) {
        // byte[] fileContent = FileCopyUtils.copyToByteArray(file);
        // return new ByteArrayResource(fileContent);
        // }

        // return null;

        // S3
        try {
            ByteArrayResource outputStream = s3Service.downloadFile("avatars/" +
                    fileName);
            return outputStream;
        } catch (Exception e) {
            log.error("Error downloading file from S3: " + e.getMessage());
        }
        return null;
    }

    public void saveAvatar(MultipartFile file, String email) throws Exception {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            log.error("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        String fileExtension = fileService.getFileExtension(file);

        if (fileExtension == null) {
            log.error("File extension is not supported");
            throw new IllegalArgumentException("File extension is not supported");
        }

        String fileName = user.getId() + "_" + String.valueOf(System.currentTimeMillis()) + "." + fileExtension;

        // Save file to local storage
        // java.io.File dest = new java.io.File(
        // "avatars/" + fileName);
        // dest = dest.getAbsoluteFile();
        // try {
        // file.transferTo(dest);
        // } catch (Exception e) {
        // log.error("Error when saving file");
        // throw new IllegalArgumentException("Error when saving file");
        // }

        // Save file to S3
        try {
            if (!user.getAvatar().equals("default.webp"))
                s3Service.delete("avatars/" + user.getAvatar());
            s3Service.uploadFile(file, "avatars/" + fileName);
        } catch (Exception e) {
            log.error("Error when saving file");
            throw e;
        }

        user.setAvatar(fileName);
        userRepo.save(user);
    }
}
