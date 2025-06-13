import { getUsuarios } from "./actions/usuarios";

export default async function HomePage() {

  const usuarios = await getUsuarios();
  console.log("🚀 ~ HomePage ~ usuarios:", usuarios)
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-black">
        {usuarios.data[0].nombre} 
        
      </div>
    </main>
  );
}
