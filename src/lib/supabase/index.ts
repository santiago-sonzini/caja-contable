"use server"
import { redirect } from "next/navigation";
import { createClientServer } from "./server";

 const getUserServer = async (): Promise<any>  => {
    const supabase = createClientServer()
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    return user
}

export default getUserServer
