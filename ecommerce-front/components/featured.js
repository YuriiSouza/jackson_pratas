import styled from "styled-components";
import Center from "./center";
import PrimaryBtn from "./button";
import { theme } from "@/styles/themes";
import Button from "./button";
import ButtonLink from "./buttonLink";
import CartIcon from "./icon/cart";

const Bg = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: 50px 0;
  `;

const Title = styled.h1`
  margin:0;
  font-weight:normal;
  font-size: 3rem;
`;

const Desc = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const ColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: .8fr 1.2fr;
  gap: 40px;

  img{
    max-width: 100%;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export default function Featured({product}) {
  return (
    <Bg>
      <Center>
      <ColumnWrapper>
        <Column>
        <div>
          <Title>{product.name}</Title>
          <Desc>{product.description} </Desc>
          <ButtonsWrapper>
            <ButtonLink href={'/produtos/'+product.id} $border={1}>Ver mais</ButtonLink>
            <Button $primary={1}>
            <CartIcon />
              Comprar
            </Button>
          </ButtonsWrapper>
        </div>
        </Column>
        <Column>
          <img src="http://localhost:9000/pratasimages/1746066330296-6ks7mj.png"></img>
        </Column>
      </ColumnWrapper>
      </Center>
    </Bg>
  );
}