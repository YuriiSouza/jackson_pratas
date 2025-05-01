import Link from "next/link";
import styled from "styled-components";
import Center from "./center";
import { theme } from "@/styles/themes";

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.header};
`;

const Logo = styled(Link)`
  color: ${({ theme }) => theme.colors.highlight};
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 15px
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.highlight};
  text-decoration: none;
`;

export default function Header() {
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
        <Logo href={'/'}>Jackson Pratas</Logo>
        <StyledNav>
          <NavLink href={'/'}>Home</NavLink>
          <NavLink href={'/produtos'}>Produtos</NavLink>
          <NavLink href={'/categorias'}>Categorias</NavLink>
          <NavLink href={'/conta'}>Account</NavLink>
          <NavLink href={'/cart'}>Carrinho (0)</NavLink>
        </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}