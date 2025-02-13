import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/queries";
import { FaPlus } from "react-icons/fa";

export default function RelatedProducts({ productCategoryID }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryId: productCategoryID, channel: "default-channel" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const products = data?.products?.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    price: node.pricing?.priceRange?.start?.gross?.amount || 0,
    imageUrl: node.thumbnail?.url || "/placeholder.svg",
  }));

  return (
    <div className="w-full py-8">
      <h2 className="text-base font-normal mb-6">YOU MAY BE INTERESTED IN</h2>
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="flex-none w-[280px]">
            <div className="relative group">
              <div className="aspect-[3/4] bg-gray-100 relative mb-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                <button className="absolute bottom-4 right-4 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <FaPlus className="h-4 w-4" />
                  <span className="sr-only">Add to cart</span>
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-normal">{product.name}</h3>
              <p className="text-sm">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
