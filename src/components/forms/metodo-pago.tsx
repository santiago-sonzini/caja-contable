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

// Zod Schema para validación
const formSchema = z.object({
  nombre: z.string(),
  descripcion: z.string().optional(),
});


export type MetodoPagoFormValues = z.infer<typeof formSchema>;

export default function CrearMetodoDePago({
  onSubmit,
}: {
  onSubmit: (values: MetodoPagoFormValues) => Promise<any>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const form = useForm<MetodoPagoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const handleSubmit = async (values: MetodoPagoFormValues) => {
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
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" {...field} />
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
                <Input placeholder="Descripción" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <div className="pt-2">
          <Button type="submit" disabled={loading}>
            {!loading ? "Guardar metodo de pago" : <Loading />}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </Form>
  );
}
