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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next-nprogress-bar";
import Loading from "@/components/loading";
import { CategoriaIngreso, Cuenta, MetodoPago } from "@prisma/client";
import { getCategorias } from "@/app/actions/categorias";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMetodosDePago } from "@/app/actions/metodo-pago";
import { getCuentas } from "@/app/actions/cuentas";
import { toast } from "../ui/use-toast";

// Zod Schema para validación
const formSchema = z.object({
  monto: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Monto inválido" }),
  descripcion: z.string().optional(),
  fecha: z.string().datetime().or(z.string().min(1, "Campo requerido")), // acepta string tipo ISO
  categoriaId: z.string().min(1, "Selecciona una categoría"),
  metodoPagoId: z.string().min(1, "Selecciona un método de pago"),
  cuentaId: z.string().min(1, "Selecciona una cuenta"),
});

type SelectOptions = Array<{ value: string; label: string }>;

export type IngresoFormValues = z.infer<typeof formSchema>;

export default function CrearIngreso({
  onSubmit,
}: {
  onSubmit: (values: IngresoFormValues) => Promise<any>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryOptions, setCategoryOptions] = useState<SelectOptions>([]);
  const [metodosDePago, setMetodosDePago] = useState<SelectOptions>([]);
  const [cuentas, setCuentas] = useState<SelectOptions>([]);

  useEffect(() => {
    const fetchData = async () => {
      const resCategorias = await getCategorias();
      const resMetodos = await getMetodosDePago();
      const resCuentas = await getCuentas();

      if (
        resCategorias.status === 200 &&
        resMetodos.status === 200 &&
        resCuentas.status === 200
      ) {
        setMetodosDePago(
          resMetodos.data.map((c: MetodoPago) => ({
            value: c.id,
            label: c.nombre,
          })),
        );
        setCategoryOptions(
          resCategorias.data.map((c: CategoriaIngreso) => ({
            value: c.id,
            label: c.nombre,
          })),
        );
        setCuentas(
          resCuentas.data.map((c: Cuenta) => ({
            value: c.id,
            label: `${c.nombre} - ${c.numero}`,
          })),
        );
      } else {
        toast({
          title: "Error",
          description: "Error al obtener datos, recarga la página",
        });
      }
    };

    fetchData();
  }, []);

  const form = useForm<IngresoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monto: "",
      descripcion: "",
      fecha: new Date().toISOString().split("T")[0], // solo fecha
      categoriaId: "",
      metodoPagoId: "",
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

        <FormField
          control={form.control}
          name="categoriaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metodoPagoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metodo de pago</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un metodo de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {metodosDePago.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cuentaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuenta</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cuentas.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="w-full flex items-center justify-between">
                      <p>
                        {option.label.split(" - ")[0]}
                      </p>
                      <p className="text-gray-500">
                        #{option.label.split(" - ")[1]}
                      </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

       

        <div className="pt-2">
          <Button type="submit" disabled={loading}>
            {!loading ? "Guardar ingreso" : <Loading />}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </Form>
  );
}
