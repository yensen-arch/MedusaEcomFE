import React from "react";
import { GET_PRODUCTS_BY_CATEGORY } from "../graphql/queries";
import { useQuery } from "@apollo/client";

function RelatedProducts({ productCategoryID }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { categoryId: productCategoryID, channel: "default-channel" }, // Changed to categoryId
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.products.edges.map(({ node }) => (
        <div key={node.id}>
          <p>{node.name}</p>
          <img src={node.thumbnail.url} alt={node.name} />
        </div>
      ))}
    </div>
  );
}

export default RelatedProducts;
