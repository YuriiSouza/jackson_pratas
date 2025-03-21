import Layout from "@/components/layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products(){
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    })
  }, []);
  
  return (
    <Layout>
      <Link className="bg-yellow-500 text-white py-1 px-2" href={'/products/new'}>Adicionar</Link>
    
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>IDs</td>
            <td>Nome do Produto</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td className="flex flex-lin gap-1">
                <Link href={'/products/edit/'+product.id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                  Editar
                </Link>
                <Link href={'/products/edit/'+product.id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>

                  Excluir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}