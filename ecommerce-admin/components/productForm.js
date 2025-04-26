import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./spinner";
import Sortable from "sortablejs";
import { ReactSortable } from "react-sortablejs";
import categories from "@/pages/categories";

export default function ProductForm({
  id,
  name: existName,
  description: existDescription,
  price: existPrice,
  stock: exitStock,
  category: existCategory,
  images: existImages,
  allImagesIds: existImagesIds,
  properties: assignedProperties
}) {
  const [name, setName] = useState(existName || '');
  const [description, setDescription] = useState(existDescription || '');
  const [price, setPrice] = useState(existPrice || '');
  const [stock, setStock] = useState(exitStock || '');
  const [category, setCategory] = useState(existCategory || '');
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [images, setImages] = useState(existImages || []);

  const [allCategories, setAllCategories] = useState([]);
  const [allImagesIds, setAllImagesIds] = useState(existImagesIds || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isuploading, setIsUploading] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories')
      .then(response => setAllCategories(response.data))
      .catch(error => console.error("Erro ao buscar categorias", error));
    }, []);


    function deleteImage(index) {

      const id = allImagesIds[index];

      axios.delete(`/api/images?type=product&id=${id}`)
        .catch(error => console.error("Erro ao deletar imagem:", error));
    }
    
  function saveProduct(ev) {
    ev.preventDefault();

    if(id) {
      //update
      const data = {
        name, 
        description, 
        price, 
        stock, 
        category, 
        allImagesIds, 
        properties: productProperties
      };
        axios.put('/api/products', {...data, id});
        
        setGoToProducts(true);
    } else {
      const data = {
        name, 
        description, 
        price, 
        stock, 
        category, 
        allImagesIds,
        properties: productProperties
      };
      console.log(productProperties)
    axios.post('/api/products', data);
      
      setGoToProducts(true);
    }
  }

  function updateImagesOrder(newOrder) {
    setImages(newOrder);
  }

  function setProductProp(propName, value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps
    })
  }
  
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
  
      for (const file of files) {
        data.append("files", file);
      }

  
      try {
        const res = await axios.post(`/api/uploadImages`, data, {
          headers: {'Content-Type': 'multiparty/form-data'}
        });
  
        setImages((oldImages) => [...oldImages, ...res.data.images]);
        setAllImagesIds((oldIds) => [...oldIds, ...res.data.ids]);
      } catch (error) {
        console.error("Erro no upload de imagem:", error);
      }
      setIsUploading(false);
    }
  }

  const propertiesToFill = [];
  if(allCategories.length > 0 && category) {
    let catInfo = allCategories.find(({id}) => id ===category);
    propertiesToFill.push(...catInfo.properties);

    while(catInfo?.parent?.id) {
      const parentCat = allCategories.find(({id}) => id === catInfo?.parent?.id)
      propertiesToFill.push(parentCat.properties);

      catInfo = parentCat;
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
      
        <div className="flex flex-col pb-5 w-55">
          <label>Categoria</label>
          <select
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
            required
          >
            <option className="text-blue-900" value="">Selecione uma categoria</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
      
        {propertiesToFill.length > 0 && propertiesToFill
          .filter(p => p.values.length > 1) // 👈 só propriedades com mais de 1 valor
          .map(p => (
            <div key={p.name} className="flex flex-row pb-5 place-items-center gap-2">
              <div>{p.name}</div>
              <select 
                value={productProperties[p.name] || ''}
                onChange={ev => setProductProp(p.name, ev.target.value)}
              >
                {Array.isArray(p.values) && p.values.map(v => (
                  <option key={v.value} value={v.value}>
                    {v.value}
                  </option>
                ))}
              </select>
            </div>
        ))}

        
        <label>
          Fotos
        </label>
        <div className="mb-2 flex flex-row pb-10 place-items-center gap-4">
          <label className="w-32 h-32 curson-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              Upload
            </div>
            <input type="file" className="hidden" onChange={uploadImages}></input>
          </label>
              {isuploading && (
                <div className="h-24 p-1 bg-gray-200 flex items-center">
                  <Spinner></Spinner>
                </div>
              )}
          <div>
            {!images?.length && (
              <div>Sem fotos</div>
            )}
            {!!images?.length && images.map((link, index) => (
              <div key={allImagesIds[index]} className="relative group">
                <img className="h-24 inline-block rounded-lg" src={link} alt=""/>
                <button 
                  onClick={() => deleteImage(index)}
                  className="absolute top-0 right-0 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>
              ))}
          </div>
        </div>

        <button type="submit" className="btn-primary">Salvar</button>
      </form>
  )
}