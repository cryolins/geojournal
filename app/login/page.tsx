"use client";
import { useForm, SubmitHandler } from "react-hook-form";

interface LoginInput{
    userOrEmail: string
    password: string
};

export default function Login() {
    const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<LoginInput>();
    const onSubmit: SubmitHandler<LoginInput> = (data) => (
        console.log(data)
    );

    return(
        <div className="flex min-h-screen min-w-screen items-center justify-center bg-background px-4">
            <div className="flex flex-col w-lg h-auto p-8 gap-y-6 items-center bg-backgroundlight rounded-2xl drop-shadow">
                <h2 className="contrast-text">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full h-auto gap-y-5">
                    <div className="flex flex-col w-full gap-y-6 mb-2">
                        <div className="flex flex-col w-full">
                            <input {...register("userOrEmail", { required: "Username or email required", pattern: {value: /^[A-Za-z0-9._+@%-]+$/i, message: "Invalid username or email"}})} 
                                placeholder="Username or email" className="input-field w-full" autoComplete="off"/>
                            {errors.userOrEmail ? <p role="alert" className="mt-1 text-bad">{errors.userOrEmail.message}</p> : null}
                        </div>
                        <div className="flex flex-col w-full">
                            <input {...register("password", { required: "Password required" })} placeholder="Password" className="input-field w-full" type="password" autoComplete="off"/>
                            {errors.password ? <p role="alert" className="mt-1 text-bad">{errors.password.message}</p> : null}
                        </div>
                        
                    </div>
                    <button type="submit" className="rounded-full contrast-text items-center justify-center w-2/5 py-3 bg-primary hover:bg-secondary transition-colors">
                        <h5 className="font-bold">Sign in{isSubmitting ? "..." : ""}</h5>
                    </button>                    
                </form>
            </div>
        </div>
    );
};