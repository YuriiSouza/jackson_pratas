import Header from "@/components/header";
import styled from "styled-components";
import Center from "@/components/center";
import ProductsGrid from "@/components/productsGrid";
import Title from "@/components/title";
import { useEffect } from "react";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export default function ProductsPage({products}) {
  return (
    <>
      <Header />
      <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  const data = { typeReq: 'all' };
  let products = [];

  try {
    const response = await axios.get('http://localhost:3000/api/product', {
      params: data,
    });
    products = response.data;
  } catch (error) {
    console.error('Erro ao coletar todos os produtos:', error);
  }

  return {
    props: {
      products,
    },
  };
}