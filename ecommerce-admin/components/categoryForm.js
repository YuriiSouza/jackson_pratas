import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CategoryForm({
  id,
  name: existName
}) {

  const [name, setName] = useState(existName || '');
  const [goToCategoies, setGoToCategories] = useState(false);
  const router = useRouter();


  function saveCategory(ev) {
    ev.preventDefault();

    if(id) {
      //update
      const data = {name};
      axios.put('/api/categories', {...data, id});
      
      setGoToCategories(true);
    } else {
      const data = {name};
      axios.post('/api/categories', data);
      
      setGoToCategories(true);
    }
  }

  if(goToCategoies) {
    router.push('/categories')
  }
  
  return (
      <form onSubmit={saveCategory}>
        
        <label>Nome da Categoria</label>
        <input 
          type="text" 
          placeholder="Nome" 
          value={name} 
          onChange={ev => setName(ev.target.value)}
        />

        <button type="submit" className="btn-primary">Salvar</button>
      </form>
  )
}