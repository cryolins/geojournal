import { auth } from "@/auth";
import { EditForm, Profile } from "@/components/settings";
import { redirect } from "next/navigation";


export default async function Settings() {
    // session data
    const session = await auth();
    if (!session) {
        // fallback case when signed out from another tab
        redirect("/login");
    }

    const { username, name, email } = session.user;

    return (
        <div className="flex flex-col sm:flex-row min-h-screen min-w-full items-center sm:items-start justify-center bg-background p-6 sm:p-12 gap-8 sm:gap-28">
            <Profile />
            <EditForm username={username} name={name} email={email}/>
        </div>
    );
}