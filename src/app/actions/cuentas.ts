"use server"

import { CuentaFormValues } from "@/components/forms/cuenta";
import { db } from "@/server/db";

interface ApiResponse {
  status: number;
  message: string;
  data?: any;
}

export async function createCuenta(input: CuentaFormValues, adminId: string): Promise<ApiResponse> {
    try {
      const cuentas = await db.cuenta.create({
        data: {
          nombre: input.nombre,
          numero: input.numero,
          tipo: input.tipo,
          admin: {
            connect: {
              id: adminId
            }
          },
        },
      });
      return {status: 200, message: "cuenta creada correctamente", data: cuentas};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al crear cuenta", data: null};
    }
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