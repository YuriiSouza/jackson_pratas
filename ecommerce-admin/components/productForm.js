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
  category: existCategory,
  images
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

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      
      for (const file of files) {
        data.append('file', file)
      }

      const res = await axios.post('/api/uploadImages', data, {
        headers: {'Content-Type': 'multiparty/form-data'}
      });
      console.log(res.data);
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

        <label>
          Fotos
        </label>
        <div className="mb-2">
          <label className="w-32 h-32 curson-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              Upload
            </div>
            <input type="file" className="hidden" onChange={uploadImages}></input>
          </label>
          {!images?.length && (
            <div>Sem fotos</div>
          )}
        </div>

        <button type="submit" className="btn-primary">Salvar</button>
      </form>
  )
}