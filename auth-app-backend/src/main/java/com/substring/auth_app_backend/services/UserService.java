package com.substring.auth_app_backend.services;

import com.substring.auth_app_backend.dtos.UserDto;

public interface UserService {
    //  create user
    UserDto createUser(UserDto userDto);

    //  get user by email
    UserDto getUserByEmail(String email);

    //  get user by id
    UserDto getUserById(String userId);

    //  get all user
    Iterable<UserDto> getAllUsers();

    //  update user
    UserDto updateUser(UserDto userDto, String userId);

    //  delete user
    void deleteUser(String userId);
}
