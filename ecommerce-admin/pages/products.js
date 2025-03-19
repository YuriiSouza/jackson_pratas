import Layout from "@/components/layout";
import Link from "next/link";
import { useState } from "react";

export default function Products(){
  
  return (
    <Layout>
      <Link className="bg-yellow-500 text-white py-1 px-2" href={'/products/new'}>Adicionar</Link>
    </Layout>
  )
}