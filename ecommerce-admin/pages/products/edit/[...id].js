import Layout from "@/components/layout";
import ProductForm from "@/components/productForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [info, setInfo] = useState(null)
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    if (!id) return;
  
    axios.get('/api/products?id=' + id)
      .then(response => {
        setInfo(response.data);
      })
      .catch(error => console.error("Erro ao buscar produto:", error));
  }, [id]);
  

  return (
    <Layout>
      
      <h1>Editar produto</h1>
      {info && (
        <ProductForm {...info} />
      )}


    </Layout>
  )
}