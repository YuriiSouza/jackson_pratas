import Link from "next/link";
import styled from "styled-components";
import Center from "./center";
import { useContext } from "react";
import { CartContext } from "./cartContext";
import { useSession } from "next-auth/react";

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.header};
`;

const Logo = styled.a`
  color: ${({ theme }) => theme.colors.highlight};
  font-weight: bold;
  font-size: 1.5rem;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.colors.highlight};
  text-decoration: none;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20%;
  // object-fit: cover;
`;

export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Link href="/" passHref legacyBehavior>
            <Logo>Jackson Pratas</Logo>
          </Link>
          <StyledNav>
            <Link href="/" passHref legacyBehavior>
              <NavLink>Home</NavLink>
            </Link>
            <Link href="/produtos" passHref legacyBehavior>
              <NavLink>Produtos</NavLink>
            </Link>
            <Link href="/categorias" passHref legacyBehavior>
              <NavLink>Categorias</NavLink>
            </Link>
            <Link href="/account" passHref legacyBehavior>
              <NavLink>Conta</NavLink>
            </Link>
            <Link href="/cart" passHref legacyBehavior>
              <NavLink>Carrinho ({cartProducts.length})</NavLink>
            </Link>
            {user?.image && <UserImage src={user?.image} alt="Foto de Perfil" />}
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
