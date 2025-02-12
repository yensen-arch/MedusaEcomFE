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
  const productData = data.product;
  const description = productData.description || "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* First Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="relative aspect-square">
          <img
            src={product.thumbnail.url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-2xl ">{product.name.toUpperCase()}</h1>
          <div className="space-y-1">
            <p className="text-2xl">
              {product.pricing.priceRange.start.gross.amount}{" "}
              {product.pricing.priceRange.start.gross.currency}
            </p>
            <p className="text-xs text-gray-500">MRP INCL. OF ALL TAXES</p>
          </div>

          <div className="pt-4 border-t">
            <p className="text-gray-700 mb-2">{product.variants?.[0]?.name}</p>
            <button className="w-full py-3 px-4 border border-black text-center hover:bg-black hover:text-white transition-colors">
              ADD
            </button>
          </div>

          <div className="pt-6">
            <p className="text-sm mb-4">Model height: 170 cm | Size: S</p>
            <div
              className="prose prose-sm"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
          </div>

          <div className="space-y-4 pt-6">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer border-t py-4">
                <span className="text-sm">COMPOSITION, CARE & ORIGIN</span>
                <span className="transform group-open:rotate-180">▼</span>
              </summary>
              <div className="pb-4 text-xs">
                <p>Product care and composition details...</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer border-t py-4">
                <span className="text-sm">CHECK IN-STORE AVAILABILITY</span>
                <span className="transform group-open:rotate-180">▼</span>
              </summary>
              <div className="pb-4 text-xs">
                <p>STORE AVALIBILITY INFO...</p>
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer border-t py-4">
                <span className="text-sm">SHIPPING, EXCHANGES AND RETURNS</span>
                <span className="transform group-open:rotate-180">▼</span>
              </summary>
              <div className="pb-4 text-xs ">
                <p>SHIPPING AND RETURN POLICY DETAILS...</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Second Section - Reversed Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="order-2 md:order-1 space-y-6">
          <div className="prose prose-sm">
            <h2 className="text-sm">PRODUCT DETAILS</h2>
            <p dangerouslySetInnerHTML={{ __html: description }}></p>
          </div>
        </div>
        <div className="order-1 md:order-2 relative aspect-square">
          <img
            src={product.thumbnail.url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={product.thumbnail.url || "/placeholder.svg"}
              alt={`${product.name} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
