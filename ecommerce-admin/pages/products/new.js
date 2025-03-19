import Layout from "@/components/layout";
import axios from "axios";
import { useState } from "react";

export default function NewProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  
  function createProduct(ev) {
    ev.preventDefault();

    const data = {name, description, price};
    axios.post('/api/products', data);
  }
  
  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>Novo Produto</h1>
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
      </form>
    </Layout>
  )
}