import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";

const Product = () => {
  const { productId } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId, channel: "default-channel" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;

  return (
    <div>
      <h2>{product.name}</h2>
      <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
      <p>
        Price: {product.pricing.priceRange.start.gross.amount}{" "}
        {product.pricing.priceRange.start.gross.currency}
      </p>
      <img src={product.thumbnail.url} alt={product.name} />
    </div>
  );
};

export default Product;
