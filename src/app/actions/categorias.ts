"use server"

import { CategoriaFormValues } from "@/components/forms/categoria";
import { db } from "@/server/db";

interface ApiResponse {
  status: number;
  message: string;
  data?: any;
}

export async function createCategoriaIngreso(input: CategoriaFormValues): Promise<ApiResponse> {
    try {
      const categorias = await db.categoriaIngreso.create({
        data: {
          nombre: input.nombre,
          descripcion: input.descripcion || "Sin descripción",
        },
      });
      return {status: 200, message: "categoria creada correctamente", data: categorias};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al crear categoria", data: null};
    }
}

export async function getCategoriasIngreso(): Promise<ApiResponse> {
    try {
      const categorias = await db.categoriaIngreso.findMany();
      return {status: 200, message: "categorias encontrados", data: categorias};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al obtener categorias", data: null};
    }
 
}

// Modelo de Categorías para Egresos


export async function createCategoriaEgreso(input: CategoriaFormValues): Promise<ApiResponse> {
    try {
      const categorias = await db.categoriaEgreso.create({
        data: {
          nombre: input.nombre,
          descripcion: input.descripcion || "Sin descripción",
        },
      });
      return {status: 200, message: "categoria creada correctamente", data: categorias};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al crear categoria", data: null};
    }
}

export async function getCategoriasEgreso(): Promise<ApiResponse> {
    try {
      const categorias = await db.categoriaEgreso.findMany();
      return {status: 200, message: "categorias encontrados", data: categorias};
    } catch (error) {
      console.log("error", error);
      return {status: 500, message: "error al obtener categorias", data: null};
    }
 
}