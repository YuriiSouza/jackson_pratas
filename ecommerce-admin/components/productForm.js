import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
  name: existName,
  description: existDescription,
  price: existPrice,
  stock: exitStock,
  category: existCategory
}) {
  const [name, setName] = useState(existName || '');
  const [description, setDescription] = useState(existDescription || '');
  const [price, setPrice] = useState(existPrice
     || '');
  const [stock, setStock] = useState(exitStock || '');
  const [categoryProduct, setCategory] = useState(existCategory || '');
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  function createProduct(ev) {
    ev.preventDefault();

    const data = {name, description, price};
    axios.post('/api/products', data);
    
    setGoToProducts(true);
  }

  if(goToProducts) {
    router.push('/products')
  }
  
  return (
      <form onSubmit={createProduct}>
        
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

        <label>Estoque</label>
        <input 
          type="number" 
          placeholder="Estoque" 
          value={stock} 
          onChange={ev => setStock(ev.target.value)}
        />
      
        <label>Category</label>
        <input 
          type="text"
          placeholder="Category" 
          value={categoryProduct} 
          onChange={ev => setCategory(ev.target.value)}
        />

        <button type="submit" className="btn-primary">Salvar</button>
      </form>
  )
}