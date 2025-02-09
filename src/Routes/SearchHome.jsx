"use client";

import { useState, useRef, useEffect } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import SearchProducts from "../Components/SearchProducts";
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries';

const SearchHome = () => {

  const { loading, error, data } = useQuery(GET_CATEGORIES);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const categories = data.categories.edges.map((edge) => edge.node);
    console.log(categories);
  const [activeCategory, setActiveCategory] = useState("WOMAN");
  const [selectedCategory, setSelectedCategory] = useState("");
  const categoryNames = ["WOMAN", "MAN", "KIDS", "BEAUTY"];
  const items = [
    "Dresses",
    "Shoes",
    "Accessories",
    "Tops",
    "Jeans",
    "Skirts",
    "Jackets",
    "Bags",
    "Jewelry",
    "Swimwear",
    "Activewear",
    "Lingerie",
  ];

  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationRef = useRef(null);

  // Auto-scroll function
  const autoScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 1; // Adjust speed
      if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
        scrollRef.current.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(autoScroll);
    }
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(autoScroll);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [autoScroll]); // Added autoScroll to dependencies

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory("");
  };

  return (
    <>
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryNames={categoryNames}
      />
      <div className="mx-auto mt-60 flex flex-col min-h-screen">
        <div className="flex flex-col justify-center items-center">
          <p className="text-lg font-semibold">WHAT ARE YOU LOOKING FOR?</p>
          <div
            ref={scrollRef}
            className="overflow-hidden mt-10 w-full max-w-4xl flex space-x-4 cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {[...items, ...items].map((item, index) => (
              <span
                key={index}
                className="mx-2 py-1 px-3 text-sm  border border-black hover:bg-gray-300 cursor-pointer whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="p-12">
          <SearchProducts selectedCategory={selectedCategory} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchHome;
