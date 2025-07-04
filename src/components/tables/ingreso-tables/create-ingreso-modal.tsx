"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Edit, Plus } from "lucide-react";
import { useClientMediaQuery } from "@/hooks/useClientMediaQuery";
import CrearIngreso, { IngresoFormValues } from "@/components/forms/ingreso";
import { toast } from "@/components/ui/use-toast";
import { createIngreso } from "@/app/actions/ingresos";

export function CreateIngresoModal({ userId, adminId }: { userId: string, adminId: string | null }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useClientMediaQuery("(min-width: 768px)");

  const handleSubmit = async (input: IngresoFormValues) => {
    console.log("🚀 ~ handleSubmit ~ input:", input);
    const res = await createIngreso(input, userId)
    console.log("🚀 ~ handleSubmit ~ res:", res)

    if (res.status === 200) {
      toast({
        title: "Success",
        description: res.message,
      });
      //window.location.reload();
      return null;
    } else {
      toast({
        title: "Error",
        description: res.message,
      });
      return res;
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="border border-gray-200 bg-white p-4 text-black hover:bg-gray-100"
          >
            <>
              <Plus className="mr-2 h-4 w-4" />
              Crear Ingreso
            </>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:w-[50vw] md:max-w-[50vw]">
          <DialogHeader>
            <DialogDescription className="max-h-[80vh] w-full overflow-y-scroll p-2 no-scrollbar">
              <DialogTitle className="mb-4">Crear Ingreso</DialogTitle>
              <CrearIngreso adminId={adminId} onSubmit={handleSubmit} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={"default"}
          className="border border-gray-200 bg-white p-4 text-black hover:bg-gray-100"
        >
          <>
            <Plus className="mr-2 h-4 w-4" />
            Crear Ingreso
          </>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="mb-10 text-left">
          <DrawerDescription className="max-h-[60vh] w-full overflow-y-scroll p-2">
          <DrawerTitle className="mb-4">Crear Ingreso</DrawerTitle
          >

            <CrearIngreso adminId={adminId} onSubmit={handleSubmit} />
          </DrawerDescription>
          <DrawerClose asChild>{/* <Button>Close</Button> */}</DrawerClose>
        </DrawerHeader>
        <DrawerFooter className="pt-2"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
