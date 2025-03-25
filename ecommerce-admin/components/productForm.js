import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProductForm({
  id,
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
  const [category, setCategory] = useState(existCategory || '');
  const [allCategories, setAllCategories] = useState([])
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories')
      .then(response => setAllCategories(response.data))
      .catch(error => console.error("Erro ao buscar categorias", error));
  }, []);

  useEffect(() => {
    console.log(allCategories);
  }, [allCategories]); 

  function saveProduct(ev) {
    ev.preventDefault();

    if(id) {
      //update
      const data = {name, description, price, stock, category};
      axios.put('/api/products', {...data, id});
      
      setGoToProducts(true);
    } else {
      const data = {name, description, price, stock, category};
      axios.post('/api/products', data);
      
      setGoToProducts(true);
    }
  }

  if(goToProducts) {
    router.push('/products')
  }
  
  return (
      <form onSubmit={saveProduct}>
        
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
      
        <div className="flex flex-col pb-10 w-55">
          <label>Categoria</label>
          <select
            value={category}
            onChange={(ev) => setCategory(ev.target.key)}
            required
          >
            <option className="text-blue-900" value="">Selecione uma categoria</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <button type="submit" className="btn-primary">Salvar</button>
      </form>
  )
}