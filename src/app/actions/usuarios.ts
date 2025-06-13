"use server"
import { db } from "@/server/db";

interface ApiResponse {
  status: number;
  message: string;
  data?: any;
}

export async function getUsuarios(): Promise<ApiResponse> {
    try {
      const usuarios = await db.usuario.findMany();
      return {status: 200, message: "usuarios encontrados", data: usuarios};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al obtener usuarios", data: null};
    }
 
}