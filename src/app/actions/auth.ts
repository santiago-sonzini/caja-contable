'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';

import { createClientServer } from '@/lib/supabase/server'







export async function login(values: any) {
  const supabase = createClientServer()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })
  console.log("🚀 ~ login ~ data:", data)



  if (error ) {
    return {status: 401, message: error.message}
    //redirect('/error')
  }


  redirect('/')

  return {status: 200, message: "Logged in successfully"}

}

export async function signup(values: any) {
  const supabase = createClientServer()

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options:{
      data: {
        name: values.email.split('@')[0]
      }
    }
  })

  if (error) {
    console.log("🚀 ~ signup ~ error:", error)
    return {status: 401, message: error.message}
    //redirect('/error')
  }

  return {status: 200, message: "Logged in successfully"}


}


export async function signOut() {
  const supabase = createClientServer()
  const { error } = await supabase.auth.signOut()
  if (!error) {
    revalidatePath('/')
  }
}