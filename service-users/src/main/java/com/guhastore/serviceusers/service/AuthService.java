package com.guhastore.serviceusers.service;

import com.guhastore.serviceusers.dto.RegisterDto;
import com.guhastore.serviceusers.dto.UserDto;
import com.guhastore.serviceusers.dto.LoginDto;
import com.guhastore.serviceusers.dto.JwtAuthResponseDto;
import com.guhastore.serviceusers.dto.ChangePasswordDto;
import com.guhastore.serviceusers.model.User;
import com.guhastore.serviceusers.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.guhastore.serviceusers.model.Role;
import java.time.Instant;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Tiêm Bean mã hóa
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
   

    public UserDto register(RegisterDto registerDto) {
        // 1. Kiểm tra xem email đã tồn tại chưa
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được đăng ký!");
        }

        // 2. Tạo đối tượng User mới
        User newUser = new User();
        newUser.setFullName(registerDto.getFullName());
        newUser.setEmail(registerDto.getEmail());
        
        // 3. Mã hóa mật khẩu trước khi lưu
        newUser.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        
        newUser.setPhoneNumber(registerDto.getPhoneNumber());
        newUser.setAddress(registerDto.getAddress());
        newUser.setRole(Role.CUSTOMER); // Sửa thành Enum // Mặc định là khách hàng
        newUser.setRegistrationDate(Instant.now());

        // 4. Lưu vào CSDL
        User savedUser = userRepository.save(newUser);

        // 5. Chuyển đổi User (Entity) sang UserDto (để trả về)
        UserDto userDto = new UserDto();
        userDto.setId(savedUser.getId());
        userDto.setFullName(savedUser.getFullName());
        userDto.setEmail(savedUser.getEmail());
        userDto.setPhoneNumber(savedUser.getPhoneNumber());
        userDto.setAddress(savedUser.getAddress());
        userDto.setRole(savedUser.getRole());

        return userDto;
    }
   
    public JwtAuthResponseDto login(LoginDto loginDto) {
       
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        
        SecurityContextHolder.getContext().setAuthentication(authentication);



       
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Lỗi không xác định"));
        String token = jwtService.generateToken(user);
        UserDto userDto = mapUserToUserDto(user);

        
        return new JwtAuthResponseDto(token, userDto);
    }

    
    private UserDto mapUserToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFullName(user.getFullName());
        userDto.setEmail(user.getEmail());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setAddress(user.getAddress());
        userDto.setRole(user.getRole());
        return userDto;
    }

    public void changePassword(Long currentUserId, ChangePasswordDto changePasswordDto) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Mật khẩu hiện tại không đúng");
        }
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);
    }
}