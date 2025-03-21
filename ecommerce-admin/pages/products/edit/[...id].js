import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function EditProductPage() {
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get('api/products?id='+id).then(response => {
      console.log(response.data);
    })
  }, [id])

  return (
    <Layout>
      test
          {/* <form onSubmit={}>
            <h1>Editar Produto</h1>
            <label>Nome do Produto</label>
            <input 
              type="text" 
              placeholder="Nome" 
              value={name} 
              onChange={ev => setName(ev.target.value)}
            />
        
            <label>Descrição</label>
            <textarea 
              placeholder="Descrição"
              value={description} 
              onChange={ev => setDescription(ev.target.value)}
            ></textarea>
            
            <label>Preço (R$)</label>
            <input 
              type="number" 
              placeholder="Preço" 
              value={price} 
              onChange={ev => setPrice(ev.target.value)}
            />
          
            <button type="submit" className="btn-primary">Salvar</button>
          </form> */}
        </Layout>
  )
}