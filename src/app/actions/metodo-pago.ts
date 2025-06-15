"use server"

import { db } from "@/server/db";

interface ApiResponse {
  status: number;
  message: string;
  data?: any;
}

export async function getMetodosDePago(): Promise<ApiResponse> {
    try {
      const metodos = await db.metodoPago.findMany();
      return {status: 200, message: "metodos de pago encontrados", data: metodos};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al obtener metodos de pago", data: null};
    }
 
}