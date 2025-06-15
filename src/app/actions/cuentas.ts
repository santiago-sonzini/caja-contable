"use server"

import { db } from "@/server/db";

interface ApiResponse {
  status: number;
  message: string;
  data?: any;
}

export async function getCuentas(): Promise<ApiResponse> {
    try {
      const metodos = await db.cuenta.findMany();
      return {status: 200, message: "cuentas encontradas", data: metodos};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al obtener cuentas", data: null};
    }
 
}