import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AuthTabs } from "@/components/forms/auth/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Login",
  description: "",
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="relative z-20 flex items-center gap-x-4 text-lg font-medium">
          Caja Contable
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2"></blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4">
        <div className="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <AuthTabs />
        </div>
      </div>
    </div>
  );
}
