import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [ready, setReady] = useState(false); // evita problemas de SSR

  // Carrega o carrinho do localStorage quando o componente monta
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = window.localStorage.getItem("cart");
      if (storedCart) {
        try {
          setCartProducts(JSON.parse(storedCart));
        } catch (e) {
          console.error("Erro ao ler o carrinho do localStorage", e);
        }
      }
      setReady(true);
    }
  }, []);

  // Salva no localStorage sempre que o carrinho mudar
  useEffect(() => {
    if (ready) {
      window.localStorage.setItem("cart", JSON.stringify(cartProducts));
    }
  }, [cartProducts, ready]);

  function addProduct(productId) {
    setCartProducts((prev) => [...prev, productId]);
  }

  function removeProduct(productId) {
    setCartProducts((prev) => {
      const index = prev.indexOf(productId);
      if (index === -1) return prev;
      const updated = [...prev];
      updated.splice(index, 1); // remove uma ocorrência
      return updated;
    });
  }

  function clearCart() {
    setCartProducts([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
