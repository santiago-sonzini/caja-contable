"use server"

import { IngresoFormValues } from "@/components/forms/ingreso";
import { IngresoWithRelations } from "@/components/tables/ingreso-tables/columns";
import { db } from "@/server/db";
// Tipo para la respuesta de la API
export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}


export async function getIngresos(): Promise<ApiResponse<IngresoWithRelations[]>> {
  try {
    const ingresos = await db.ingreso.findMany({
      include: {
        categoria: true,
        metodoPago: true,
        usuario: true
      },
      orderBy: {
        fecha: 'desc' // Ordenar por fecha descendente (más recientes primero)
      }
    });

    return {
      status: 200,
      message: `Se encontraron ${ingresos.length} ingresos`,
      data: ingresos
    };

  } catch (error) {
    console.error('Error al obtener ingresos:', error);
    
    return {
      status: 500,
      message: error instanceof Error 
        ? `Error al obtener ingresos: ${error.message}`
        : 'Error desconocido al obtener ingresos',
      data: undefined
    };
  }
}


export async function create(input: IngresoFormValues, userId: string): Promise<ApiResponse<IngresoWithRelations>> {
  try {
    const ingresos = await db.ingreso.create({
      data: {
        descripcion: input.descripcion || "Sin descripción",
        fecha: new Date(input.fecha + 'T00:00:00.000Z'),
        monto: input.monto,
        categoriaId: input.categoriaId,
        metodoPagoId: input.metodoPagoId, 
        usuarioId: userId,
        cuentaId: input.cuentaId
      },
      include: {
        categoria: true,
        metodoPago: true,
        usuario: true
      },
    });
    return {
      status: 200,
      message: `Se ha creado el ingreso correctamente`,
      data: ingresos
    };
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      message: error instanceof Error 
        ? `Error al crear ingreso: ${error.message}`
        : 'Error desconocido al crear ingreso',
      data: undefined
    };
  }
}
export async function createIngreso(input: IngresoFormValues, userId: string): Promise<ApiResponse<IngresoWithRelations>> {
  try {
    const ingresos = await db.ingreso.create({
      data: {
        descripcion: input.descripcion || "Sin descripción",
        fecha: new Date(input.fecha + 'T00:00:00.000Z'),
        monto: input.monto,
        categoriaId: input.categoriaId,
        metodoPagoId: input.metodoPagoId, 
        usuarioId: userId,
        cuentaId: input.cuentaId
      },
      include: {
        categoria: true,
        metodoPago: true,
        usuario: true
      },
    });
    return {
      status: 200,
      message: `Se ha creado el ingreso correctamente`,
      data: ingresos
    };
  } catch (error) {
    console.log("error", error);
    return {
      status: 500,
      message: error instanceof Error 
        ? `Error al crear ingreso: ${error.message}`
        : 'Error desconocido al crear ingreso',
      data: undefined
    };
  }
}

export async function updateIngreso(id: string, ingreso: any) {
  const ingresos = await db.ingreso.update({
    where: { id },
    data: ingreso,
  });
  return ingresos;
}

export async function deleteIngreso(id: string) {
  const ingresos = await db.ingreso.delete({
    where: { id },
  });
  return ingresos;
}     