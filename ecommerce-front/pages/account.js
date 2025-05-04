// components/Layout.js
import Header from "@/components/header";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "@/styles/themes";
import Center from "@/components/center";
import Button from "@/components/button";
import axios from "axios";
import { useRouter } from "next/router";

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginScreen = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const FlexLayout = styled.div`
  display: flex;
`;

const Content = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  flex-grow: 1;
  padding: 1rem;
`;

const UserInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
  text-align: center;
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const UserImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const OrderList = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OrderItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const OrderTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const OrderInfo = styled.p`
  font-size: 1rem;
`;

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const [orders, setOrders] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  async function logout() {
    await router.push('/');
    await signOut();
  }


  useEffect(() => {
    // Função para buscar os pedidos do usuário
    const fetchOrders = async () => {
      if (session?.user?.id) {

        await axios.post('/api/orders', {id: session?.user?.id})
        .then(response => {
          setOrders(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar produtos do carrinho:', error);
        });
      }
    };
    
    if (session) {
      fetchOrders();
    }
  }, [session]);

  if (!session) {
    return (
      <>
        <Header />
        <Center>
          <LoginScreen>
            <Button onClick={() => signIn("google")}>Login with Google</Button>
          </LoginScreen>
        </Center>
      </>
    );
  }

  const { user } = session;

  return (
    <>
      <Header />
      <Container>
        <FlexLayout>
          <Content>
            <UserInfo>
              {/* Exibe a imagem de perfil se disponível */}
              {user?.image && <UserImage src={user?.image} alt="Foto de Perfil" />}
              <InfoTitle>Informações do Usuário</InfoTitle>
              <InfoText><strong>Nome:</strong> {user?.name}</InfoText>
              <InfoText><strong>Email:</strong> {user?.email}</InfoText>
              <Button $outline={1} $black={1} onClick={() => logout()}>Sair</Button>
            </UserInfo>

            <OrderList>
              <InfoTitle>Meus Pedidos</InfoTitle>
              {orders.length === 0 ? (
                <InfoText>Você ainda não fez nenhum pedido.</InfoText>
              ) : (
                orders.map((order) => (
                  <OrderItem key={order.id}>
                    <OrderTitle>Pedido ID: {order.id}</OrderTitle>
                    <OrderInfo><strong>Nome:</strong> {order.name}</OrderInfo>
                    <OrderInfo><strong>Status:</strong> {order.status}</OrderInfo>
                    <OrderInfo><strong>Total:</strong> R${order.totalAmount}</OrderInfo>
                    <OrderInfo><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</OrderInfo>
                    <OrderInfo><strong>Método de Pagamento:</strong> {order.paymentMethod}</OrderInfo>
                  </OrderItem>
                ))
              )}
            </OrderList>
          </Content>
        </FlexLayout>
      </Container>
    </>
  );
}
