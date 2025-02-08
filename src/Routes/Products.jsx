// Products.js
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';

const Products = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.products.edges.map(({ node }) => (
        <div key={node.id}>
          <h2>{node.name}</h2>
          <p>{node.description}</p>
          <p>
            Price: {node.pricing.priceRange.start.gross.amount}{' '}
            {node.pricing.priceRange.start.gross.currency}
          </p>
          <img src={node.thumbnail.url} alt={node.name} />
        </div>
      ))}
    </div>
  );
};

export default Products;
