"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";


import * as z from "zod";

export const formSchema = z.object({
  monto: z.string().min(1, "El monto es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  fecha: z.string().min(1, "La fecha es requerida"),
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  cuentaId: z.string().min(1, "Selecciona una cuenta"),
  metodoPagoId: z.string().min(1, "Selecciona un método de pago"),
  usuarioId: z.string().min(1, "Selecciona un usuario"),
});

export type EgresoFormValues = z.infer<typeof formSchema>;


export default function CrearEgreso({
  onSubmit,
  adminId,
}: {
  onSubmit: (values: EgresoFormValues) => void;
  adminId: string | null;
}) {
  const form = useForm<EgresoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monto: "",
      descripcion: "",
      fecha: new Date().toISOString().split("T")[0],
      categoriaId: "",
      cuentaId: "",
      metodoPagoId: "",
      usuarioId: adminId ?? "",
    },
  });

  const [categorias, setCategorias] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [categ, ctas, pagos, usrs] = await Promise.all([
        fetch("/api/categorias").then(res => res.json()),
        fetch("/api/cuentas").then(res => res.json()),
        fetch("/api/metodos-pago").then(res => res.json()),
        fetch("/api/usuarios").then(res => res.json()),
      ]);
      setCategorias(categ);
      setCuentas(ctas);
      setMetodosPago(pagos);
      setUsuarios(usrs);
    }

    fetchData();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormField
          control={form.control}
          name="monto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input placeholder="Monto" type="number" {...field} />
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
                <Input placeholder="Descripción del egreso" {...field} />
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

        {/* Select Categoría */}
        <FormField
          control={form.control}
          name="categoriaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Cuenta */}
        <FormField
          control={form.control}
          name="cuentaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuenta</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {cuentas.map((cta: any) => (
                    <SelectItem key={cta.id} value={cta.id}>
                      {cta.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Método de Pago */}
        <FormField
          control={form.control}
          name="metodoPagoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pago</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {metodosPago.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Usuario (solo si es admin, por ejemplo) */}
        {adminId && (
          <FormField
            control={form.control}
            name="usuarioId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((u: any) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Guardar Egreso</Button>
      </form>
    </Form>
  );
}
