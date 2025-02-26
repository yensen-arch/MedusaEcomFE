"use client";

import { useState } from "react";

const images = [
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549299/WhatsApp_Image_2025-02-20_at_17.03.23_1_fl6ooe.jpg",
    alt: "Look 6",
    story: "67",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549301/WhatsApp_Image_2025-02-20_at_16.59.18_1_cmuksh.jpg",
    alt: "Look 1",
    story: "90",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549300/WhatsApp_Image_2025-02-20_at_17.03.55_1_le8p8n.jpg",
    alt: "Look 2",
    story: "12",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549300/WhatsApp_Image_2025-02-20_at_16.59.32_we1uof.jpg",
    alt: "Look 3",
    story:
      "89",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549300/WhatsApp_Image_2025-02-20_at_17.03.35_vyusil.jpg",
    alt: "Look 4",
    story: "32",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549300/WhatsApp_Image_2025-02-20_at_17.03.29_1_s0zttc.jpg",
    alt: "Look 5",
    story: "15",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549299/WhatsApp_Image_2025-02-20_at_17.03.12_1_pxdzve.jpg",
    alt: "Look 6",
    story: "14",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549299/WhatsApp_Image_2025-02-20_at_17.03.17_1_gftqgi.jpg",
    alt: "Look 6",
    story: "78",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549299/WhatsApp_Image_2025-02-20_at_17.00.52_1_xq6sqr.jpg",
    alt: "Look 6",
    story: "79",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549298/WhatsApp_Image_2025-02-20_at_17.03.05_bbnygm.jpg",
    alt: "Look 6",
    story: "77",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549298/WhatsApp_Image_2025-02-20_at_17.01.22_1_wjqej2.jpg",
    alt: "Look 6",
    story: "45",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549297/WhatsApp_Image_2025-02-20_at_17.00.45_1_kba8qe.jpg",
    alt: "Look 6",
    story: "43",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549297/WhatsApp_Image_2025-02-20_at_17.00.32_dkqgdl.jpg",
    alt: "Look 6",
    story: "44",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549297/WhatsApp_Image_2025-02-20_at_17.00.37_xii0wj.jpg",
    alt: "Look 6",
    story: "41",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549297/WhatsApp_Image_2025-02-20_at_17.00.18_1_vahh5r.jpg",
    alt: "Look 6",
    story: "10",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549296/WhatsApp_Image_2025-02-20_at_17.00.26_1_bg5pwb.jpg",
    alt: "Look 6",
    story: "40",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549296/WhatsApp_Image_2025-02-20_at_17.00.13_cxtko8.jpg",
    alt: "Look 6",
    story: "99",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549296/WhatsApp_Image_2025-02-20_at_17.00.08_1_hep9zm.jpg",
    alt: "Look 6",
    story: "25",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549296/WhatsApp_Image_2025-02-20_at_17.00.03_1_wjjsqk.jpg",
    alt: "Look 6",
    story: "16",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549296/WhatsApp_Image_2025-02-20_at_16.59.46_ee7udr.jpg",
    alt: "Look 6",
    story: "26",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549296/WhatsApp_Image_2025-02-20_at_16.59.59_1_qbrmrd.jpg",
    alt: "Look 6",
    story: "G",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549296/WhatsApp_Image_2025-02-20_at_16.59.37_dqlcuf.jpg",
    alt: "Look 6",
    story: "B",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549296/WhatsApp_Image_2025-02-20_at_16.59.53_gdm5qk.jpg",
    alt: "Look 6",
    story: "j",
  },
  {
    src: "https://res.cloudinary.com/dmjhto8sd/image/upload/v1740549295/WhatsApp_Image_2025-02-20_at_16.59.41_lnp9wx.jpg",
    alt: "Look 6",
    story: "L",
  },
];

function LookBook() {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (index) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-28">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-light flex items-center gap-2">
          V00{" "}
          <span className="text-xs text-gray-500">
            {new Date().toLocaleDateString()} • EARTH
          </span>
        </h1>
      </header>

      {/* Masonry Layout */}
      <div className="columns-2 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="break-inside-avoid cursor-pointer"
            onClick={() => openModal(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto border border-black "
            />
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 max-w-3xl w-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="w-auto max-h-[80vh] border border-black mb-4"
            />
            <p className="text-[0.6rem] text-gray-700">
              {images[selectedImage].story.toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LookBook;
