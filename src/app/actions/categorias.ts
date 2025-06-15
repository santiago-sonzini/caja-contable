"use server"

import { db } from "@/server/db";

interface ApiResponse {
  status: number;
  message: string;
  data?: any;
}

export async function getCategorias(): Promise<ApiResponse> {
    try {
      const categorias = await db.categoriaIngreso.findMany();
      return {status: 200, message: "categorias encontrados", data: categorias};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al obtener categorias", data: null};
    }
 
}