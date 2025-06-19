"use server"

import { db } from "@/server/db";
import { z } from "zod";
import { EgresoWithRelations } from "@/components/tables/egreso-tables/columns";

const formSchema = z.object({
  monto: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Monto inválido" }),
  descripcion: z.string().optional(),
  fecha: z.string().datetime().or(z.string().min(1, "Campo requerido")),
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  metodoPagoId: z.string().min(1, "Selecciona un método de pago"),
  cuentaId: z.string().min(1, "Selecciona una cuenta"),
});

export type EgresoFormValues = z.infer<typeof formSchema>;

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export async function getEgresos(): Promise<ApiResponse<EgresoWithRelations[]>> {
  try {
    const egresos = await db.egreso.findMany({
      include: {
        categoria: true,
        usuario: true,
      },
      orderBy: {
        fecha: "desc",
      },
    });

    return {
      status: 200,
      message: `Se encontraron ${egresos.length} egresos`,
      data: egresos,
    };
  } catch (error) {
    console.error("Error al obtener egresos:", error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function createEgreso(
  input: EgresoFormValues,
  userId: string
): Promise<ApiResponse<EgresoWithRelations>> {
  try {
    const egreso = await db.egreso.create({
      data: {
        descripcion: input.descripcion || "Sin descripción",
        fecha: new Date(input.fecha + "T00:00:00.000Z"),
        monto: input.monto,
        categoriaId: input.categoriaId,
        metodoPagoId: input.metodoPagoId,
        usuarioId: userId,
        cuentaId: input.cuentaId,
      },
      include: {
        categoria: true,
        metodoPago: true,
        usuario: true,
      },
    });

    return {
      status: 200,
      message: `Se ha creado el egreso correctamente`,
      data: egreso,
    };
  } catch (error) {
    console.error("Error al crear egreso:", error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function updateEgreso(id: string, egreso: any) {
  return await db.egreso.update({
    where: { id },
    data: egreso,
  });
}

export async function deleteEgreso(id: string) {
  return await db.egreso.delete({
    where: { id },
  });
}
