// sign in, sign up, and auth interfaces

export interface SignupInput{
    username: string
    email: string
    password: string
    confirmPassword: string
};

export interface LoginInput{
    userOrEmail: string
    password: string
};

export interface EditInput{
    username: string
    name: string
    email: string
    newPassword?: string
    confirmNewPassword?: string
    oldPassword: string
};