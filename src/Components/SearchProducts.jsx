"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/queries";
import { Link } from "react-router-dom";

function SearchProducts({ selectedCategory }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: {
      categoryId: selectedCategory?.id,
      channel: "default-channel", // Replace with your actual channel name
    },
    skip: !selectedCategory?.id, // Avoid running query when categoryId is missing
  });

  useEffect(() => {
    if (selectedCategory) {
      setSearchQuery(selectedCategory.name);
    }
  }, [selectedCategory]);

  if (loading || error) {
    return (
      <div className="text-center text-sm uppercase">
        {loading ? (
          <p className="text-gray-600">LOADING</p>
        ) : (
          <p className="text-red-500">Error: {error.message}</p>
        )}
      </div>
    );
  }

  const products = data?.products?.edges.map(({ node }) => node) || [];

  // **Search Filtering with Pattern Matching**
  const filteredProducts = !searchQuery
    ? products
    : products.filter((product) => {
        const searchTerm = searchQuery.toLowerCase().trim();
        const regex = new RegExp(searchTerm.replace(/s$/, ""), "i"); // Remove plural 's' and match

        return (
          regex.test(product.name) ||
          regex.test(product.category?.name || "") ||
          regex.test(product.slug) ||
          regex.test(
            String(product.pricing?.priceRange?.start?.gross?.amount || "")
          )
        );
      });

  // **Categorize Products**
  const categorizedProducts = {};
  filteredProducts.forEach((product) => {
    const category = product.category?.name || "UNCATEGORIZED";
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
              <Link to={`/products/${product.id}`}
                key={product.id}
                className="bg-slate-50 p-4"
              >
                <img
                  src={
                    product.thumbnail?.url || "https://via.placeholder.com/150"
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-none mb-2"
                />
                <h3 className="text-sm uppercase text-gray-700">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 uppercase">
                  {product.slug}
                </p>
                <p className="text-xs text-gray-700 mt-2">
                  PRICE: {product.pricing?.priceRange?.start?.gross?.amount}{" "}
                  {product.pricing?.priceRange?.start?.gross?.currency}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchProducts;
