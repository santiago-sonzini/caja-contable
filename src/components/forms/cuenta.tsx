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
  numero: z.string(),
  tipo: z.string(),
});


export type CuentaFormValues = z.infer<typeof formSchema>;

export default function CrearCuenta({
  onSubmit,
}: {
  onSubmit: (values: CuentaFormValues) => Promise<any>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const form = useForm<CuentaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      numero: "",
      tipo: "",
    },
  });

  const handleSubmit = async (values: CuentaFormValues) => {
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
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numero</FormLabel>
              <FormControl>
                <Input placeholder="Numero" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Input placeholder="Tipo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        

        <div className="pt-2">
          <Button type="submit" disabled={loading}>
            {!loading ? "Guardar categoria" : <Loading />}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </Form>
  );
}
