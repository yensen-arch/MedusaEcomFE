import React, { useState } from 'react'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'

const SearchHome = () => {
  const [activeCategory, setActiveCategory] = useState("WOMAN");
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
  ]

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  return (
    <>
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        categoryNames={categoryNames} ś
      />
      <div className='mx-auto mt-60 flex flex-col'>
        <div className='flex flex-col justify-center items-center'>
          <p>WHAT ARE YOU LOOKING FOR?</p>
          <div className="overflow-hidden whitespace-nowrap mt-10">
            <div className="animate-scroll">
              {[...items, ...items, ...items].map((item, index) => (
                <span key={index} className="mx-4 py-1 px-2 text-sm font-semibold border border-black ">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <input
            type='text'
            placeholder='Search here...'
            className='border-b border-black my-7 outline-none px-2 py-1 w-1/3'
          />
        </div>
        <div>
          Products can go here.
        </div>
      </div>
      <Footer />
    </>
  )
}

export default SearchHome