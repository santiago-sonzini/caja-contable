"use server"

import { CuentaFormValues } from "@/components/forms/cuenta";
import { db } from "@/server/db";
import { Cuenta, Prisma } from "@prisma/client";

interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}



export async function createCuenta(input: CuentaFormValues, adminId: string): Promise<ApiResponse<Cuenta>> {
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
      return {status: 500, message: "error al crear cuenta",};
    }
}

export async function getCuentas(): Promise<ApiResponse<Cuenta[]>> {
    try {
      const metodos = await db.cuenta.findMany();
      return {status: 200, message: "cuentas encontradas", data: metodos};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al obtener cuentas"};
    }
 
}

export type IngresoWithCategoria = Prisma.IngresoGetPayload<{
      include:{
        categoria: true
      }
}>; 

export type EgresoWithCategoria = Prisma.EgresoGetPayload<{
      include:{
        categoria: true
      }
}>;

export type CuentaWithRelations = Prisma.CuentaGetPayload<{
  include: {
    ingresos: {
      include:{
        categoria: true
      }
    };
    egresos: {
      include:{
        categoria: true
      }
    };
    admin: true;
  };
}>; 


export const getCuenta = async (id: string): Promise<ApiResponse<CuentaWithRelations>> => {
  try {
    const cuenta = await db.cuenta.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
          ingresos: {
            include:{
              categoria: true
            }
          },
          egresos: {
            include:{
              categoria: true
            }
          },
          admin: true,
      }
    });
    return {status: 200, message: "cuenta encontrada", data: cuenta};
  } catch (error) {
    console.log("error", error);
    return {status: 500, message: "error al obtener cuenta"};
  }
};

