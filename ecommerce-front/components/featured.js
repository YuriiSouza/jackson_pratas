import styled from "styled-components";
import Center from "./center";
import PrimaryBtn from "./button";
import { theme } from "@/styles/themes";
import Button from "./button";
import ButtonLink from "./buttonLink";

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>
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