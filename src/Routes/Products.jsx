import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";
import RelatedProducts from "../Components/RelatedProducts";
import Footer from "../Components/Footer";
const Product = () => {
  const { productId } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId, channel: "default-channel" },
  });
  const productCategoryID = data?.product?.category?.id;
  const catName = data?.product?.category?.name;
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;
  const description = product.description || "";

  const images = [...Array(4)].map(
    () => product.thumbnail.url || "/placeholder.svg"
  );

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const navigate = (direction) => {
    setSelectedImageIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      return newIndex < 0 ? images.length - 1 : newIndex % images.length;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-10">
      {/* First Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="relative aspect-square">
          <img
            src={product.thumbnail.url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover  cursor-pointer"
            onClick={() => openLightbox(0)}
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
            <p className="text-gray-500 mb-2">{catName.toUpperCase()}</p>
            <button className="w-full py-3 px-4 border border-black text-center hover:bg-black hover:text-white ">
              ADD
            </button>
          </div>

          <div className="pt-6">
            <p className="text-sm mb-4">Model height: 170 cm | Size: S</p>
            <div
              className="prose prose-sm"
              dangerouslySetInnerHTML={{ __html: product?.description }}
            ></div>
          </div>

          <div className="space-y-4 pt-6">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer border-t py-4">
                <span className="text-sm">COMPOSITION, CARE & ORIGIN</span>
                <span className="transform group-open:rotate-180">▼</span>
              </summary>
              <div className="pb-4 text-xs">
                <p>PRODUCT COMPOSITION DETAILS...</p>
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
            <p dangerouslySetInnerHTML={{ __html: description||"" }}></p>
          </div>
        </div>
        <div className="order-1 md:order-2 relative aspect-square">
          <img
            src={product.thumbnail.url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openLightbox(1)}
          />
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-2 gap-4">
        {images.slice(0, 4).map((image, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={image}
              alt={`${product.name} view ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openLightbox(index)}
            />
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <button
            className="absolute left-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
          >
            ←
          </button>
          <img
            src={images[selectedImageIndex]}
            alt="Fullscreen"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute right-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
          >
            →
          </button>
        </div>
      )}

      <RelatedProducts productCategoryID={productCategoryID} />
      <Footer />
    </div>
  );
};

export default Product;
