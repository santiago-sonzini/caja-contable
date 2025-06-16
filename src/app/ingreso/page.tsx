import BreadCrumb from "@/components/breadcrumb";
import { IngresoClient } from "@/components/tables/ingreso-tables/client";
import { getIngresos } from "../actions/ingresos";
import getUserServer from "@/lib/supabase";
import { redirect } from "next/navigation";
import { getUser } from "../actions/user";
import Header from "@/components/layout/header";

const breadcrumbItems = [{ title: "Ingresos", link: "/ingreso" }];
export default async function page() {
  const res = await getIngresos();
  const user = await getUserServer();

  if (!user) {
    redirect("/auth/signin");
  }

  const resUserDb = await getUser(user.id);

  if (!resUserDb.data) {
    redirect("/auth/signin");
  }

  console.log("🚀 ~ page ~ res:", res.data);
  return (
    <>
      <Header />

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 mt-10">
        <BreadCrumb items={breadcrumbItems} />
        <IngresoClient
          adminId={resUserDb.data.rol === "ADMINISTRADOR" ? user.id : null}
          userId={user.id}
          data={res.data || []}
        />
      </div>
    </>
  );
}
