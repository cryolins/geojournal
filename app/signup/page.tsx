"use client";
import { useForm, SubmitHandler } from "react-hook-form";

interface SignupInput{
    username: string
    email: string
    password: string
    confirmPassword: string
};

export default function Login() {
    const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<SignupInput>();

    //validation options
    const usernameOptions = { 
        required: "Username required", 
        pattern: { value: /^[A-Za-z0-9._-]+$/i, message: "Invalid username, only letters, numbers, and . _ - are allowed" },
        minLength: { value: 3, message: "Username must be between 3 and 20 letters long" },
        maxLength: { value: 20, message: "Username must be between 3 and 20 letters long" }
    };
    const emailOptions = {
        required: "Email required", 
        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email" }
    };
    const confirmOptions = { 
        required: "Please confirm password",
        validate: (val: string) => {
            if (watch("password") != val) {
                return "Passwords do not match";
            }
        }
    };

    const onSubmit: SubmitHandler<SignupInput> = (data) => (
        console.log(data)
    );

    return(
        <div className="flex min-h-screen min-w-screen items-center justify-center bg-background px-4">
            <div className="flex flex-col w-lg h-auto p-8 gap-y-6 items-center bg-backgroundlight rounded-2xl drop-shadow">
                <h2 className="contrast-text">Create Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full h-auto gap-y-5">
                    <div className="flex flex-col w-full gap-y-6 mb-2">
                        <div className="flex flex-col w-full">
                            <input {...register("username", usernameOptions)} placeholder="Username" className="input-field w-full" autoComplete="off"/>
                            {errors.username ? <p role="alert" className="mt-1 text-bad">{errors.username.message}</p> : null}
                        </div>
                        <div className="flex flex-col w-full">
                            <input {...register("email", emailOptions)} placeholder="Email" className="input-field w-full" autoComplete="email"/>
                            {errors.email ? <p role="alert" className="mt-1 text-bad">{errors.email.message}</p> : null}
                        </div>
                        <div className="flex flex-col w-full">
                            <input {...register("password", { required: "Password required" })} placeholder="Password" className="input-field w-full" type="password" autoComplete="current-password"/>
                            {errors.password ? <p role="alert" className="mt-1 text-bad">{errors.password.message}</p> : null}
                        </div>
                        <div className="flex flex-col w-full">
                            <input {...register("confirmPassword", confirmOptions)} placeholder="Confirm password" className="input-field w-full" type="password" autoComplete="off"/>
                            {errors.confirmPassword ? <p role="alert" className="mt-1 text-bad">{errors.confirmPassword.message}</p> : null}
                        </div>
                    </div>
                    <button type="submit" className="rounded-full contrast-text items-center justify-center w-2/5 py-3 bg-primary hover:bg-secondary transition-colors">
                        <h5 className="font-bold">Sign up{isSubmitting ? "..." : ""}</h5>
                    </button>                    
                </form>
            </div>
        </div>
    );
};