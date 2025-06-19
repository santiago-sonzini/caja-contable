// src/app/egreso/page.tsx

import BreadCrumb from "@/components/breadcrumb";
import { EgresoClient } from "@/components/tables/egreso-tables/client"; // Asegurate que este componente existe
import { getEgresos } from "../actions/egreso";
import getUserServer from "@/lib/supabase";
import { redirect } from "next/navigation";
import { getUser } from "../actions/user";
import Header from "@/components/layout/header";

const breadcrumbItems = [{ title: "Egresos", link: "/egreso" }];

export default async function Page() {
  const user = await getUserServer();

  if (!user) {
    redirect("/auth/signin");
  }

  const resUserDb = await getUser(user.id);

  if (!resUserDb.data) {
    redirect("/auth/signin");
  }

  const res = await getEgresos();

  return (
    <>
      <Header />

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 mt-10">
        <BreadCrumb items={breadcrumbItems} />
        <EgresoClient
          adminId={resUserDb.data.rol === "ADMINISTRADOR" ? user.id : null}
          userId={user.id}
          data={res.data || []}
        />
      </div>
    </>
  );
}
