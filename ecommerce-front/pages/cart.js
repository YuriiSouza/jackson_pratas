import Header from "@/components/header";
import styled from "styled-components";
import Center from "@/components/center";
import Button from "@/components/button";
import {useContext, useEffect, useState} from "react";
import { CartContext } from "@/components/cartContext";
import axios from "axios";
import Table from "@/components/table";
import Input from "@/components/input";
import ProductBox from "@/components/productBox";
import { getServerSideProps } from ".";
import NewProducts from "@/components/newProducts";
import { useSession } from "next-auth/react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
  const [products,setProducts] = useState([]);
  const [allProducts,setAllProducts] = useState([]);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [city,setCity] = useState('');
  const [postalCode,setPostalCode] = useState('');
  const [streetAddress,setStreetAddress] = useState('');
  const [country,setCountry] = useState('');
  const [isSuccess,setIsSuccess] = useState(false);
  const [numberAdress, setNumberAdress] = useState('');
  const [complementAdress, setComplementAdress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [state, setState] = useState('');

  const { data: session } = useSession();
  const user = session?.user;

  const handlePostalCodeChange = async (ev) => {
    const cep = ev.target.value.replace(/\D/g, ''); // remove caracteres não numéricos
    setPostalCode(cep);
  
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
  
        if (data.erro) {
          console.error("CEP não encontrado.");
        } else {
          setStreetAddress(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
        }
      } catch (err) {
        console.error("Erro ao buscar o CEP:", err);
      }
    }
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        await axios.get('/api/user/details', {id: session?.user?.id})
        .then(response => {
          const user = response.data;
        })
        .catch(error => {
          console.error('Erro ao buscar produtos do carrinho:', error);
        });

        setName(user.name || '');
        setEmail(user.email || '');

        if (user.address) {
          setStreetAddress(user.address.street || '');
          setCity(user.address.city || '');
          setState(user.address.state || '');
          setCountry(user.address.country || '');
          setPostalCode(user.address.postalCode || '');
          setNeighborhood(user.address.neighborhood || '');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error.response?.data || error.message);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids:cartProducts})
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar produtos do carrinho:', error);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    axios.post('/api/product')
        .then(response => {
          setAllProducts(response.data);
        })
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    const cartSummary = cartProducts.reduce((acc, id) => {
      const existing = acc.find(item => item.productId === id);
      const product = products.find(p => p.id === id);
      const price = product?.price || 0;
    
      if (existing) {
        existing.quantity += 1;
        existing.total += price;
      } else {
        acc.push({ productId: id, quantity: 1, total: price });
      }
      return acc;
    }, []);

    const response = await axios.post('/api/checkout', {
      name,email,city,postalCode,streetAddress,country,
      cartSummary, numberAdress, complementAdress, neighborhood, state
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  let total = 0;

  for (const productId of cartProducts) {
    const price = products.find(p => p.id === productId)?.price || 0;
    total += price;
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Obrigado para compra!</h1>
              <p>Te encaminharemos um email para confirmação da compra.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Cart</h2>
            {!cartProducts?.length && (
              <div>Seu carrinho esta vazio</div>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt=""/>
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button
                          onClick={() => lessOfThisProduct(product.id)}>-</Button>
                        <QuantityLabel>
                          {cartProducts.filter(id => id === product.id).length}
                        </QuantityLabel>
                        <Button
                          onClick={() => moreOfThisProduct(product.id)}>+</Button>
                      </td>
                      <td>
                        R$ {cartProducts.filter(id => id === product.id).length * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>R$ {total}</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Order information</h2>
              <Input type="text"
                     placeholder="Nome"
                     value={name}
                     name="name"
                     onChange={ev => setName(ev.target.value)} />
              <Input type="text"
                     placeholder="Email"
                     value={email}
                     name="email"
                     onChange={ev => setEmail(ev.target.value)}/>
              <CityHolder>
                <Input
                  type="text"
                  placeholder="CEP"
                  value={postalCode}
                  name="postalCode"
                  onChange={handlePostalCodeChange}/>
                <Input type="text"
                    placeholder="Cidade"
                    value={city}
                    name="city"
                    onChange={ev => setCity(ev.target.value)} />
              </CityHolder>
              
              <Input type="text"
                     placeholder="Pais"
                     value={country}
                     name="country"
                     onChange={ev => setCountry(ev.target.value)}/>
              <Input type="text"
                    placeholder="Número"
                    value={numberAdress}
                    name="numberAdress"
                    onChange={ev => setNumberAdress(ev.target.value)} />
              <Input type="text"
                    placeholder="Complemento"
                    value={complementAdress}
                    name="complementAdress"
                    onChange={ev => setComplementAdress(ev.target.value)} />
              
              <Input type="text"
                    placeholder="Rua"
                    value={streetAddress}
                    name="streetAddress"
                    onChange={ev => setStreetAddress(ev.target.value)} />

              <Input type="text"
                    placeholder="Bairro"
                    value={neighborhood}
                    name="neighborhood"
                    onChange={ev => setNeighborhood(ev.target.value)} />

              <Input type="text"
                    placeholder="Estado"
                    value={state}
                    name="state"
                    onChange={ev => setState(ev.target.value)} />


              <Button $black={1} $block={1}
                      onClick={goToPayment}>
                Continue to payment
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>

      <Center>
        <NewProducts products={allProducts} Text={'Produtos'} />
      </Center>
    </>
  );
}