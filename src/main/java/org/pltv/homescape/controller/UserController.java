package org.pltv.homescape.controller;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.pltv.homescape.dto.SuccessReponse;
import org.pltv.homescape.dto.user.ChangePasswordReq;
import org.pltv.homescape.dto.user.CheckTokenReq;
import org.pltv.homescape.dto.user.ForgetPasswordReq;
import org.pltv.homescape.dto.user.LoginReq;
import org.pltv.homescape.dto.user.LoginRes;
import org.pltv.homescape.dto.property.PropertyQueryRes;
import org.pltv.homescape.dto.user.RegisterReq;
import org.pltv.homescape.dto.user.RegisterRes;
import org.pltv.homescape.dto.user.ResetPasswordReq;
import org.pltv.homescape.dto.user.UserInfoReq;
import org.pltv.homescape.exception.BadRequestException;
import org.pltv.homescape.exception.InternalServerException;
import org.pltv.homescape.exception.NotFoundException;
import org.pltv.homescape.model.User;
import org.pltv.homescape.service.EmailService;
import org.pltv.homescape.service.JwtService;
import org.pltv.homescape.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/api/login")
    public ResponseEntity<LoginRes> login(@RequestBody LoginReq loginPost)
            throws BadRequestException, InternalServerException {
        if (loginPost.getEmail() == null || loginPost.getPassword() == null) {
            throw new BadRequestException("Missing field");
        }

        try {
            if (userService.checkUserVerified(loginPost.getEmail()) == false) {
                throw new BadRequestException("User not verified");
            }

            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginPost.getEmail(),
                            loginPost.getPassword()));

            if (authentication.isAuthenticated()) {
                return ResponseEntity.ok().body(LoginRes.builder().email(loginPost.getEmail())
                        .token(jwtService.generateToken((User) authentication.getPrincipal())).build());
            } else {
                log.error("Authentication failed");
                throw new InternalServerException("Authentication failed");
            }
        } catch (BadCredentialsException e) {
            log.info(e.getMessage());
            throw new BadRequestException("Invalid password");
        } catch (UsernameNotFoundException e) {
            log.info(e.getMessage());
            throw new BadRequestException("Email not found");
        }
    }

    @PostMapping("/api/register")
    public ResponseEntity<RegisterRes> register(@RequestBody RegisterReq registerPost) throws Exception {
        if (registerPost.getEmail() == null || registerPost.getPassword() == null
                || registerPost.getConfirmPassword() == null) {
            throw new BadRequestException("Missing field");
        }

        if (!registerPost.getPassword().equals(registerPost.getConfirmPassword())) {
            throw new BadRequestException("Passwords don't match");
        }

        userService.register(registerPost);
        return ResponseEntity.ok().body(new RegisterRes(registerPost.getEmail(), "Registration successful"));
    }

    @PostMapping("/api/checkToken")
    public ResponseEntity<SuccessReponse> checkToken(@RequestBody CheckTokenReq token) throws Exception {
        if (token == null) {
            throw new BadRequestException("Missing field");
        }

        try {
            Boolean verify = emailService.verifyEmailToken(token.getToken(), true);
            if (verify == false) {
                throw new BadRequestException("Invalid token");
            }

            return ResponseEntity.ok().body(SuccessReponse.builder().message("Valid token").build());
        } catch (Exception e) {
            throw new BadRequestException("Invalid token");
        }
    }

    @GetMapping("/api/verify/{token}")
    public ResponseEntity<SuccessReponse> verify(@PathVariable("token") String token) throws Exception {
        userService.verifyEmail(token);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Email verified").build());
    }

    @PostMapping("/api/forgotPassword")
    public ResponseEntity<SuccessReponse> forgotPassword(@RequestBody ForgetPasswordReq forgetPasswordReq)
            throws Exception {
        if (forgetPasswordReq.getEmail() == null) {
            throw new BadRequestException("Missing field");
        }

        userService.forgotPassword(forgetPasswordReq.getEmail());

        return ResponseEntity.ok().body(SuccessReponse.builder().message("Email sent")
                .build());
    }

    @PostMapping("/api/resetPassword")
    public ResponseEntity<SuccessReponse> resetPassword(@RequestBody ResetPasswordReq resetPasswordPost)
            throws Exception {
        if (resetPasswordPost.getNewPassword() == null || resetPasswordPost.getConfirmPassword() == null) {
            throw new BadRequestException("Missing field");
        }

        if (!resetPasswordPost.getNewPassword().equals(resetPasswordPost.getConfirmPassword())) {
            throw new BadRequestException("Passwords don't match");
        }

        userService.resetPassword(resetPasswordPost.getToken(), resetPasswordPost.getNewPassword());
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Password reset successfully").build());
    }

    @PostMapping("/api/user/changePassword")
    public ResponseEntity<SuccessReponse> changePassword(@RequestBody ChangePasswordReq changePasswordPost)
            throws BadRequestException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        if (changePasswordPost.getOldPassword() == null || changePasswordPost.getNewPassword() == null
                || changePasswordPost.getConfirmPassword() == null) {
            throw new BadRequestException("Missing field");
        }

        if (changePasswordPost.getOldPassword().equals(changePasswordPost.getNewPassword())) {
            throw new BadRequestException("New password must be different from old password");
        }

        if (!changePasswordPost.getNewPassword().equals(changePasswordPost.getConfirmPassword())) {
            throw new BadRequestException("Passwords don't match");
        }

        userService.changePassword(email, changePasswordPost.getOldPassword(),
                changePasswordPost.getNewPassword());
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Password changed").build());

    }

    @GetMapping("/api/user/info")
    public ResponseEntity<SuccessReponse> getInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        return ResponseEntity.ok().body(SuccessReponse.builder().message("User info")
                .data(userService.getUserInfo(email)).build());
    }

    @PostMapping("/api/user/info")
    public ResponseEntity<SuccessReponse> changeInfo(@RequestBody UserInfoReq info) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        return ResponseEntity.ok().body(SuccessReponse.builder().message("User info updated")
                .data(userService.updateUserInfo(info, email)).build());
    }

    @GetMapping("/api/user/myProperties")
    public ResponseEntity<SuccessReponse> getMyProperties(@RequestParam("page") int page) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        PropertyQueryRes myProperties = userService.getProperties(email, page);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("My properties").data(myProperties).build());
    }

    @GetMapping("/api/user/myFavorites")
    public ResponseEntity<SuccessReponse> getMyFavorites(@RequestParam("page") int page) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        PropertyQueryRes myProperties = userService.getFavoritesProperties(email, page);
        return ResponseEntity.ok()
                .body(SuccessReponse.builder().message("My favorite properties").data(myProperties).build());
    }

    @GetMapping("/api/user/favorite/{id}")
    public ResponseEntity<SuccessReponse> favorite(@PathVariable("id") Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        userService.addToFavorite(email, id);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Favorite added").build());
    }

    @DeleteMapping("/api/user/favorite/{id}")
    public ResponseEntity<SuccessReponse> unfavorite(@PathVariable("id") Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        userService.removeFromFavorite(email, id);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Favorite removed").build());
    }

    @GetMapping("/api/avatar/{fileName}")
    public ResponseEntity<StreamingResponseBody> getAvatar(@PathVariable("fileName") String fileName)
            throws IOException, NotFoundException {
        StreamingResponseBody avatar = userService.getAvatar(fileName);

        if (avatar == null) {
            throw new NotFoundException("Avatar not found");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS))
                .body(avatar);
    }

    @PostMapping("/api/user/avatar")
    public ResponseEntity<SuccessReponse> uploadAvatar(@ModelAttribute MultipartFile file) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();

        userService.saveAvatar(file, email);
        return ResponseEntity.ok().body(SuccessReponse.builder().message("Avatar uploaded").build());
    }
}
