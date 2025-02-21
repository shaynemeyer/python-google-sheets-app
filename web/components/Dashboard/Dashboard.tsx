import { useEffect, useState } from "react";
import {
  API_BASE_URL,
  SPREADSHEET_ID,
  INVENTORY_WORKSHEET_NAME,
} from "@/lib/constants";
import { Product } from "@/types/product";
import ProductCard from "../Products/ProductCard";

function Dashboard({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [cart, setCart] = useState<Array<Product>>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/${SPREADSHEET_ID}/${INVENTORY_WORKSHEET_NAME}/read`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setProducts(data);
        console.log("API response", data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [token]);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(cart);
  return (
    <div>
      <header className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
        <h2 className="text-xl font-bold">Welcome!</h2>
        <div>
          <button className="bg-white text-blue-500 font-bold py-2 px-4 rounded-md hover:bg-gray-100">
            View Cart ({cart.length})
          </button>
        </div>
      </header>
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
