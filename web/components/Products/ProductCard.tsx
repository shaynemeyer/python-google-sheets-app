"use client";

import { Product } from "@/types/product";

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
}) {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full"
      key={product.id}
    >
      <img
        className="w-full h-48 object-cover mb-4 rounded-md"
        src={product.image_url}
        alt={product.name}
      />
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p className="text-gray-500 mb-2 flex-grow">{product.description}</p>
      <p className="text-lg font-bold mb-4">{product.price}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
}
export default ProductCard;
