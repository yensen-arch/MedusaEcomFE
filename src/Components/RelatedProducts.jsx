import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/queries";
import { FiPlus } from "react-icons/fi";

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
      <h2 className="text-base text-center font-normal px-2 mb-6">YOU MAY BE INTERESTED IN</h2>
      <div className="flex overflow-x-auto pb-4 mx-4 px-4 scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-none w-[280px] "
          >
            <div className="relative group">
              <div className="aspect-[3/4]  relative mb-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full  h-full cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/products/${product.id}`)
                  }
                />
                <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white opacity-60 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <FiPlus className="h-4 w-4" />
                  <span className="sr-only">Add to cart</span>
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-normal text-center">{product.name.toUpperCase()}</h3>
              <p className="text-sm text-center">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
