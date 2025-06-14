"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import Loading from "@/components/loading";

// Zod Schema para validación
const formSchema = z.object({
  monto: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Monto inválido" }),
  descripcion: z.string().min(1, "Campo requerido"),
  fecha: z.string().datetime().or(z.string().min(1, "Campo requerido")), // acepta string tipo ISO
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  metodoPagoId: z.string().min(1, "Selecciona un método de pago"),
  usuarioId: z.string().min(1, "Selecciona un usuario"),
});

export type IngresoFormValues = z.infer<typeof formSchema>;

export default function CrearIngreso(
  { onSubmit }: { onSubmit: (values: IngresoFormValues) => Promise<any> }
) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<IngresoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monto: "",
      descripcion: "",
      fecha: new Date().toISOString().split("T")[0], // solo fecha
      categoriaId: "",
      metodoPagoId: "",
      usuarioId: "",
    },
  });

  const handleSubmit = async (values: IngresoFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }    
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="monto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input placeholder="Ej. 1234.56" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Pago de cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Relaciones por ID (pueden ser reemplazadas por selects dinámicos) */}
        <FormField
          control={form.control}
          name="categoriaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Categoría</FormLabel>
              <FormControl>
                <Input placeholder="categoriaId" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metodoPagoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Método de Pago</FormLabel>
              <FormControl>
                <Input placeholder="metodoPagoId" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usuarioId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Usuario</FormLabel>
              <FormControl>
                <Input placeholder="usuarioId" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button type="submit" disabled={loading}>
            {!loading ? "Guardar ingreso" : <Loading />}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </Form>
  );
}