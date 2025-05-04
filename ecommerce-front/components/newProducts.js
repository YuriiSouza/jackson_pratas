import styled from "styled-components";
import Center from "./center";
import ProductsGrid from "./productsGrid";

const Title = styled.h2`
  font-size: 2rem;
  margin:30px 0 20px;
  font-weight: normal;
`;

export default function NewProducts({products}) {
  return (
    <Center>
      <Title>Nossos Produtos</Title>
      <ProductsGrid products={products} />
    </Center>
  );
}