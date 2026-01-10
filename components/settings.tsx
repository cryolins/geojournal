"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { LogoutButton } from "./auth/auth-buttons";
import { EditInput } from "@/interfaces/user-input";
import { useState } from "react";
import { useMounted } from "./use-mounted";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface EditFormProps{
    username: string
    name: string
    email: string
}

interface SubmitMsg{
    message: string
    ok: "good" | "bad"
}

export function Profile() {
    
    return (
        <div className="flex flex-col h-fit w-full sm:w-sm items-center sm:items-start gap-y-8">
            <h1 className="text-center sm:text-left contrast-text font-bold">Account Settings</h1>
            <img className="w-3/5 max-w-3xs rounded-full aspect-square" src="vercel.svg" alt="Profile picture" />
            <LogoutButton />
        </div>
    );
}

export function EditForm({ username, name, email }: EditFormProps) {
    // hooks
    const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<EditInput>();
    const [submitMsg, setSubmitMsg] = useState<SubmitMsg>({ message: "", ok: "bad" });
    const clearSubmitMsg = () => (setSubmitMsg({ message: "", ok: "bad" }));
    const [mounted] = useMounted();
    const { update } = useSession();

    // check if mounted to avoid hydration error
    if (!mounted) {
        return (
            <div className="flex items-center align-center">
                <h1 className="contrast-text font-bold">Loading...</h1>
            </div>
        );
    }

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
    const nameOptions = { 
        required: "Name required"
    };
    const newPasswordOptions = {
        minLength: { value: 8, message: "Password must be at least 8 characters" }
    };
    const confirmNewPasswordOptions = { 
        validate: (val: string | undefined) => {
            if (watch("newPassword") != val) {
                return "New passwords do not match";
            }
        }
    };
    const oldPasswordOptions = { 
        required: "Please verify your current password to update"
    };

    // submit handler
    const onSubmit: SubmitHandler<EditInput> = async (inp) => {
        // create data
        const { username, name, email, oldPassword } = inp;
        const newPassword = inp.newPassword || undefined; // if falsy, make undefined

        // try sending to PUT endpoint
        try {
            const res = await fetch("/api/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username, name, email, newPassword, oldPassword
                })
            });
            const resData: any = await res.json();
            if (res.status == 401) {
                setSubmitMsg({ message: "Invalid password", ok: "bad" });
            } else if (!res.ok) {
                setSubmitMsg({ message: "Error updating details, please try again", ok: "bad" });
                console.error(resData.message);
            } else {
                await update({ 
                    username: resData.username, name: resData.name, email: resData.email
                 });
                 setSubmitMsg({ message: "Success!", ok: "good" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-fit w-full gap-y-6 items-center sm:items-start">
            <h2 className="font-bold">Edit Details</h2>
            <div className="flex flex-col h-fit w-full gap-y-4">
                <div className="flex flex-col w-full gap-y-1">
                    <h5>Username</h5>
                    <input {...register("username", usernameOptions)} placeholder="Username" defaultValue={username} 
                    className="input-field w-full" autoComplete="off" onChange={clearSubmitMsg}/>
                    {errors.username ? <p role="alert" className="mt-1 text-bad">{errors.username.message}</p> : null}
                </div>
                <div className="flex flex-col w-full gap-y-1">
                    <h5>Email</h5>
                    <input {...register("email", emailOptions)} placeholder="Email" defaultValue={email} 
                    className="input-field w-full" autoComplete="email" onChange={clearSubmitMsg}/>
                    {errors.email ? <p role="alert" className="mt-1 text-bad">{errors.email.message}</p> : null}
                </div>
                <div className="flex flex-col w-full gap-y-1">
                    <h5>Name</h5>
                    <input {...register("name", nameOptions)} placeholder="Name" defaultValue={name} 
                    className="input-field w-full" autoComplete="name" onChange={clearSubmitMsg}/>
                    {errors.name ? <p role="alert" className="mt-1 text-bad">{errors.name.message}</p> : null}
                </div>
                <div className="flex flex-col w-full gap-y-1">
                    <h5>New password (optional)</h5>
                    <input {...register("newPassword", newPasswordOptions)} placeholder="New Password" className="input-field w-full" type="password" autoComplete="new-password"/>
                    {errors.newPassword ? <p role="alert" className="mt-1 text-bad">{errors.newPassword.message}</p> : null}
                </div>
                <div className="flex flex-col w-full gap-y-1">
                    <h5>Confirm new password (if applicable)</h5>
                    <input {...register("confirmNewPassword", confirmNewPasswordOptions)} placeholder="Confirm password" className="input-field w-full" type="password" autoComplete="off"/>
                    {errors.confirmNewPassword ? <p role="alert" className="mt-1 text-bad">{errors.confirmNewPassword.message}</p> : null}
                </div>
                <div className="flex flex-col w-full gap-y-1">
                    <h5>Verify with current password</h5>
                    <input {...register("oldPassword", oldPasswordOptions)} placeholder="Verify with current password" className="input-field w-full" type="password" autoComplete="off"/>
                    {errors.oldPassword ? <p role="alert" className="mt-1 text-bad">{errors.oldPassword.message}</p> : null}
                </div>
            </div>
            {!!submitMsg.message ? <p className={`text-${submitMsg.ok}`}>{submitMsg.message}</p> : null}
            <button type="submit" className="rounded-full contrast-text items-center justify-center w-2xs py-2 bg-primary hover:bg-secondary transition-colors">
                <h5 className="font-bold">{isSubmitting ? "Updating..." : "Update"}</h5>
            </button>  
        </form>
    );
}