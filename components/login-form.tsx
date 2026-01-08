"use client";
import { signIn } from "next-auth/react";
import { LoginInput } from "@/interfaces/user-input";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";


export default function LoginForm() {
    const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<LoginInput>();
    const router = useRouter();
    const [submitMsg, setSubmitMsg] = useState<string>("");
    
    const onSubmit: SubmitHandler<LoginInput> = async (data) => {
        //console.log(data)
        try {
            const res = await signIn("credentials", {
                userOrEmail: data.userOrEmail,
                password: data.password,
                redirect: false,
            });
            
            if (res.error) {
                switch (res.code) {
                    case "InvalidCredentials":
                        setSubmitMsg("Invalid username, email, or password.");
                        break;
                    case "MissingCredentials":
                        // technically this case should not occur with react hook form
                        // but it is a fallback just in case
                        setSubmitMsg("Please enter the required login details.");
                        break;
                    default:
                        setSubmitMsg("An unexpected error occurred, please try again.");
                        break;
                }
            }
            else {
                router.push("/map");
            }
        } catch (error) {
            setSubmitMsg("An unexpected error occurred, please try again.");
        }
        
    };

    const clearSubmitMsg = () => (setSubmitMsg(""));

    return(
        <div className="flex min-h-screen min-w-screen items-center justify-center bg-background px-4">
            <div className="flex flex-col w-lg h-auto p-8 gap-y-6 items-center bg-backgroundlight rounded-2xl drop-shadow">
                <h2 className="contrast-text">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full h-auto gap-y-5">
                    <div className="flex flex-col w-full gap-y-6 mb-2">
                        <div className="flex flex-col w-full">
                            <input {...register("userOrEmail", { required: "Username or email required", pattern: {value: /^[A-Za-z0-9._+@%-]+$/i, message: "Invalid username or email"}})} 
                                placeholder="Username or email" className="input-field w-full" autoComplete="off" onChange={clearSubmitMsg}/>
                            {errors.userOrEmail ? <p role="alert" className="mt-1 text-bad">{errors.userOrEmail.message}</p> : null}
                        </div>
                        <div className="flex flex-col w-full">
                            <input {...register("password", { required: "Password required" })} placeholder="Password" className="input-field w-full" type="password" autoComplete="off"
                                onChange={clearSubmitMsg}/>
                            {errors.password ? <p role="alert" className="mt-1 text-bad">{errors.password.message}</p> : null}
                        </div>
                        
                    </div>
                    {!!submitMsg ? <p className="text-bad">{submitMsg}</p> : null}
                    <button type="submit" className="rounded-full contrast-text items-center justify-center w-2/5 py-3 bg-primary hover:bg-secondary transition-colors">
                        <h5 className="font-bold">Sign in{isSubmitting ? "..." : ""}</h5>
                    </button>   
                    <p>
                        Don't have an account? {" "}
                        <Link href={"/signup"} className="contrast-text hover:underline">Sign up</Link>
                    </p>                 
                </form>
            </div>
        </div>
    );
};