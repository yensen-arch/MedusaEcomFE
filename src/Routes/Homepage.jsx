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
    WOMAN: [
      {
        path: "women1",
        img: "https://static.zara.net/assets/public/1c74/6ff4/64a74930be5c/0c2d1724a7ff/image-landscape-46d31401-b6cc-4ddd-ba6f-59743156450d-default_0/image-landscape-46d31401-b6cc-4ddd-ba6f-59743156450d-default_0.jpg?ts=1737365086986&w=1384",
      },
      {
        video:
          "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381505/jeans_mzvwwq.mp4",
      },
      { type: "footer" },
    ],
    MAN: [
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
      {
        path: "men3",
        img: "https://static.zara.net/assets/public/9bc7/a9a5/319340e6906f/029055b12a04/image-landscape-default-fill-da20bbac-05ba-467c-83f9-396121a29f7b-default_0/image-landscape-default-fill-da20bbac-05ba-467c-83f9-396121a29f7b-default_0.jpg?ts=1736429615385&w=1384",
      },
      { type: "footer" },
    ],
    KIDS: [
      {
        video:
          "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
        cat: "kids",
      },
      { type: "footer" },
    ],
    BEAUTY: [
      {
        video:
          "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
        cat: "beauty",
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
    }, 10000);

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
                        controls={ele.cat !== "kids"}
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
