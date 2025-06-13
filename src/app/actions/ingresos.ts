"use server"

import { db } from "@/server/db";

export async function getIngresos() {
  const ingresos = await db.ingreso.findMany();
  return ingresos;
}


export async function createIngreso(ingreso: any) {
  const ingresos = await db.ingreso.create({
    data: ingreso,
  });
  return ingresos;
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