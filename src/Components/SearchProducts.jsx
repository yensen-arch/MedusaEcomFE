"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";

function SearchProducts(selectedCategory) {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading)
    return <p className="text-center text-gray-600 uppercase text-sm">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 uppercase text-sm">Error: {error.message}</p>;

  const products = data?.products?.edges.map(({ node }) => node) || [];
  const filteredProducts = !searchQuery
    ? products
    : products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const categorizedProducts = {};
  filteredProducts.forEach((product) => {
    const category = product.category?.name || "Uncategorized";
    if (!categorizedProducts[category]) {
      categorizedProducts[category] = [];
    }
    categorizedProducts[category].push(product);
  });

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="SEARCH"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-b border-black text-center text-lg outline-none px-2 py-1 w-full sm:w-3/4 md:w-1/2"
        />
      </div>
      <p className="text-lg pb-8">YOU MAY BE LOOKING FOR</p>

      {/* Product Categories */}
      {Object.entries(categorizedProducts).map(([category, products]) => (
        <div key={category} className="mb-8">
          <h3 className="text-sm uppercase text-gray-700 mb-2">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-50 p-4 rounded-lg shadow">
                <img
                  src={product.thumbnail?.url || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="text-sm uppercase text-gray-700">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.slug}</p>
                <p className="text-xs text-gray-700 mt-2">
                  Price: {product.price?.amount} {product.price?.currency}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchProducts;
