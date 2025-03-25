import CategoryForm from "@/components/categoryForm";
import Layout from "@/components/layout";
import ProductForm from "@/components/productForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewProduct() {
  return (
    <Layout>
      <h1>Novo Produto</h1>
      <CategoryForm />
    </Layout>
  );
}