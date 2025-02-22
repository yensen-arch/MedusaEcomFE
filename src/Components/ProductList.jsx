import React from 'react';
import { Link } from 'react-router-dom';
import { useProductPrefetch } from '../hooks/useProductPrefetch';
import ProductSkeleton from './ProductSkeleton';

const ProductList = ({ products, loading }) => {
  const { prefetchProduct } = useProductPrefetch();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products?.map(product => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          className="group"
          onMouseEnter={() => prefetchProduct(product.id)}
        >
          <div className="relative overflow-hidden">
            <img
              src={product.thumbnail?.url}
              alt={product.name}
              className="w-full h-64 object-cover transition-transform group-hover:scale-105"
            />
            <div className="p-4">
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {product.pricing?.priceRange?.start?.gross?.amount} 
                {product.pricing?.priceRange?.start?.gross?.currency}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;