'use server'

import { db } from "@/server/db";
import { Usuario } from "@prisma/client";

interface ApiResponse {
  status: number;
  message: string;
  data: Usuario | null;
}

export async function getUser(id: string): Promise<ApiResponse> {
    try {
      const user = await db.usuario.findUnique({
        where: {
          id: id
        },
        
      });
      return {status: 200, message: "usuario encontrado", data: user};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al obtener usuario", data: null};
    }
 
}