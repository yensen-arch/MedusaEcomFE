"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import FooterLP from "../Components/FooterLP";
import { motion, AnimatePresence } from "framer-motion";

const Homepage = () => {
  const categories = {
    V00: [
      {
        path: "v00",
        img: "https://static.zara.net/assets/public/0f07/a1b5/4032449e93c9/afd2524e0ccc/image-landscape-default-fill-2d499829-5793-421f-abaa-3a4c14bc6f08-default_0/image-landscape-default-fill-2d499829-5793-421f-abaa-3a4c14bc6f08-default_0.jpg?ts=1738333082655&w=1458",
      },
      {
        video:
          "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
      },
      { type: "footer" },
    ],
    WOMAN: [
      {
        path: "women1",
        img: "https://static.zara.net/assets/public/1c74/6ff4/64a74930be5c/0c2d1724a7ff/image-landscape-46d31401-b6cc-4ddd-ba6f-59743156450d-default_0/image-landscape-46d31401-b6cc-4ddd-ba6f-59743156450d-default_0.jpg?ts=1737365086986&w=1384",
      },
      {
        path: "women2",
        img: "https://static.zara.net/assets/public/756a/1804/42284cf58611/7312275089cb/image-landscape-1-17aa02ad-7eaf-499d-93ef-d3b8b9d9a78d-default_0/image-landscape-1-17aa02ad-7eaf-499d-93ef-d3b8b9d9a78d-default_0.jpg?ts=1738570252190&w=1458",
      },
      {
        video:
          "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381505/jeans_mzvwwq.mp4",
      },
      { type: "footer" },
    ],
    MAN: [
      {
        path: "men2",
        video: "blob:https://www.zara.com/cf821dd4-10f1-412c-885c-5bebb8a7d728",
      },
      {
        path: "men1",
        img: "https://static.zara.net/assets/public/a04f/7c52/7208479d90b3/405b1951ea68/image-landscape-default-fill-a4d13a6e-dbe6-4259-b2a9-ca2d6c155f52-default_0/image-landscape-default-fill-a4d13a6e-dbe6-4259-b2a9-ca2d6c155f52-default_0.jpg?ts=1736427762917&w=1384",
      },
      {
        path: "men2",
        video: "blob:https://www.zara.com/cf821dd4-10f1-412c-885c-5bebb8a7d728",
      },
      {
        path: "men2",
        img: "https://static.zara.net/assets/public/4894/1c0a/4b78411c84c8/87ed0fc65938/image-landscape-default-fill-727a6739-cd4d-49a6-858a-181f8454ef44-default_0/image-landscape-default-fill-727a6739-cd4d-49a6-858a-181f8454ef44-default_0.jpg?ts=1736755109152&w=1384",
      },

      { type: "footer" },
    ],
    KIDS: [
      {
        path: "kids1",
        img: "https://static.zara.net/assets/public/2303/2c32/27194a8ebfe2/d953f040a732/image-landscape-82ed3571-a5ca-4554-915c-f0ee0594752d-default_0/image-landscape-82ed3571-a5ca-4554-915c-f0ee0594752d-default_0.jpg?ts=1738328934570&w=1458",
      },
      {
        path: "kids2",
        img: "https://static.zara.net/assets/public/41ba/c718/52cf40dc824d/e6ad3d7b124a/image-landscape-default-fill-f6349ccf-53b1-4705-99bd-eb067aff9217-default_0/image-landscape-default-fill-f6349ccf-53b1-4705-99bd-eb067aff9217-default_0.jpg?ts=1738328910178&w=1458",
      },
      {
        path: "kids3",
        img: "https://static.zara.net/assets/public/8311/5d39/02c045aba096/ed3e2c83fb91/image-landscape-fill-7334a51d-9bbb-44ef-aedf-6f06e5fdb446-default_0/image-landscape-fill-7334a51d-9bbb-44ef-aedf-6f06e5fdb446-default_0.jpg?ts=1737727708400&w=1458",
      },
      {
        video:
          "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
        cat: "kids",
      },
      { type: "footer" },
    ],
    ARCHIVE: [
      {
        video:
          "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
        cat: "archive",
      },
      { type: "footer" },
    ],
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [indexNo, setIndex] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const categoryNames = Object.keys(categories);
  const [activeCategory, setActiveCategory] = useState(categoryNames[0]);
  const [direction, setDirection] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideNext();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIndex(categoryNames.indexOf(activeCategory));
  }, [activeCategory, categoryNames]);

  const handlePrev = () => {
    if (indexNo > 0) {
      setDirection(-1);
      setActiveCategory(categoryNames[indexNo - 1]);
      setShowFooter(false);
    }
  };

  const handleNext = () => {
    if (indexNo < categoryNames.length - 1) {
      setDirection(1);
      setActiveCategory(categoryNames[indexNo + 1]);
      setShowFooter(false);
    }
  };

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
    if (categories[activeCategory][swiper.activeIndex]?.type === "footer") {
      setTimeout(() => {
        swiper.slideTo(0);
      }, 10000); // Adjust delay
    }
  };

  const handleCategoryChange = (category) => {
    const newIndex = categoryNames.indexOf(category);
    setDirection(newIndex > indexNo ? 1 : -1);
    setActiveCategory(category);
  };

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  return (
    <div className="relative w-full h-screen cursor-pointer overflow-hidden">
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={handleCategoryChange}
        categoryNames={categoryNames}
        activeIndex={activeIndex}
        categories={categories}
        showSearchBar
      />
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeCategory}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 60 },
            opacity: { duration: 0.2 },
          }}
          className="w-full h-full absolute"
        >
          <Swiper
            modules={[Mousewheel, FreeMode]}
            direction="vertical"
            ref={swiperRef}
            slidesPerView={1}
            mousewheel={true}
            freeMode={true}
            speed={800}
            onSlideChange={handleSlideChange}
            className="w-full h-full"
          >
            {categories[activeCategory]?.map((ele, index) => (
              <SwiperSlide key={index} className="w-full h-screen">
                {ele.type === "footer" ? (
                  <div>
                    <FooterLP />
                  </div>
                ) : (
                  <Link to={`/products`} state={{ query: ele.path }}>
                    {ele.img ? (
                      <img
                        src={ele.img || "/placeholder.svg"}
                        alt="Slide"
                        className="w-full h-screen object-cover"
                      />
                    ) : ele.video ? (
                      <video
                        autoPlay
                        loop
                        muted
                        className="w-full h-screen object-cover"
                      >
                        <source src={ele.video} type="video/mp4" />
                      </video>
                    ) : null}
                  </Link>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </AnimatePresence>
      <div className="absolute flex items-center justify-between w-full top-1/2 z-10 px-4">
        {indexNo > 0 && (
          <button
            onClick={handlePrev}
            className={`flex items-center bg-transparent border-none font-light ${
              activeIndex % 2 === 0 ? "text-white" : "text-black"
            }`}
          >
            <ArrowBackIosIcon fontSize="small" />
          </button>
        )}
        {indexNo < categoryNames.length - 1 && (
          <button
            onClick={handleNext}
            className={`flex items-center bg-transparent border-none font-light ml-auto ${
              activeIndex % 2 === 0 ? "text-white" : "text-black"
            }`}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Homepage;
