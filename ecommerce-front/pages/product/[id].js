import Center from "@/components/center";
import Header from "@/components/header";
import Title from "@/components/title";
import styled from "styled-components";
import WhiteBox from "@/components/whiteBox";
import ProductImages from "@/components/productImage";
import Button from "@/components/button";
import CartIcon from "@/components/icon/cart";
import { useContext } from "react";
import { CartContext } from "@/components/cartContext";
import axios from "axios";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

export default function ProductPage({product}) {
  const {addProduct} = useContext(CartContext);
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>${product.price}</Price>
              </div>
              <div>
                <Button $primary={1} onClick={() => addProduct(product.id)}>
                  <CartIcon />Add to cart
                </Button>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  const {id} = context.query;

  let product = {}

  
  await axios.get('http://localhost:3000/api/product?id='+id)
  .then((response) => {
    console.log(response.data)
    product = response.data;
  })
  .catch((error) => {
    console.error('Erro ao coletar todos os produtos:', error);
  })

  return {
    props: {
      product,
    },
  };


}