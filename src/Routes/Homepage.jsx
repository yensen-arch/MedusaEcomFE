"use client"

import { useState, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Mousewheel } from "swiper"
import "swiper/css"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Link } from "react-router-dom"
import Navbar from "../Components/Navbar"
import FooterLP from "../Components/FooterLP"
import { motion, AnimatePresence } from "framer-motion"

SwiperCore.use([Mousewheel])

const Homepage = () => {
  const Women = [
    {
      path: "women1",
      img: "https://static.zara.net/assets/public/1c74/6ff4/64a74930be5c/0c2d1724a7ff/image-landscape-46d31401-b6cc-4ddd-ba6f-59743156450d-default_0/image-landscape-46d31401-b6cc-4ddd-ba6f-59743156450d-default_0.jpg?ts=1737365086986&w=1384",
    },
    {
      video: "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381505/jeans_mzvwwq.mp4",
    },
  ]

  const Men = [
    {
      path: "men1",
      img: "https://static.zara.net/assets/public/a04f/7c52/7208479d90b3/405b1951ea68/image-landscape-default-fill-a4d13a6e-dbe6-4259-b2a9-ca2d6c155f52-default_0/image-landscape-default-fill-a4d13a6e-dbe6-4259-b2a9-ca2d6c155f52-default_0.jpg?ts=1736427762917&w=1384",
    },
    { path: "men2", video: "blob:https://www.zara.com/cf821dd4-10f1-412c-885c-5bebb8a7d728" },
    {
      path: "men2",
      img: "https://static.zara.net/assets/public/4894/1c0a/4b78411c84c8/87ed0fc65938/image-landscape-default-fill-727a6739-cd4d-49a6-858a-181f8454ef44-default_0/image-landscape-default-fill-727a6739-cd4d-49a6-858a-181f8454ef44-default_0.jpg?ts=1736755109152&w=1384",
    },
    {
      path: "men3",
      img: "https://static.zara.net/assets/public/9bc7/a9a5/319340e6906f/029055b12a04/image-landscape-default-fill-da20bbac-05ba-467c-83f9-396121a29f7b-default_0/image-landscape-default-fill-da20bbac-05ba-467c-83f9-396121a29f7b-default_0.jpg?ts=1736429615385&w=1384",
    },
  ]

  const Kids = [
    {
      video: "https://res.cloudinary.com/dzsxh31vj/video/upload/v1737381101/gett0nihpxj7tgkg4tg3.mp4",
      cat: "kids",
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [indexNo, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [showFooter, setShowFooter] = useState(false)
  const category = ["Women", "Men", "Kids"]
  const swiperRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.swiper.slideNext()
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handlePrev = () => {
    if (indexNo > 0) {
      setDirection(-1)
      setIndex((prev) => prev - 1)
      setShowFooter(false)
    }
  }

  const handleNext = () => {
    if (indexNo < category.length - 1) {
      setDirection(1)
      setIndex((prev) => prev + 1)
      setShowFooter(false)
    }
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex)
    if (swiper.isEnd && indexNo === category.length - 1) {
      setShowFooter(true)
    } else {
      setShowFooter(false)
    }
  }

  return (
    <div className="relative w-full h-screen cursor-pointer overflow-hidden">
      <Navbar style={{ display: "none" }} activeIndexs={activeIndex} setIndex={setIndex} />
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={indexNo}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.5 }}
          className="absolute w-full h-full"
        >
          <Swiper
            direction="vertical"
            ref={swiperRef}
            slidesPerView={1}
            mousewheel
            speed={800}
            onSlideChange={handleSlideChange}
            className="w-full h-full"
          >
            {eval(category[indexNo])?.map((ele, index) => (
              <SwiperSlide key={index} className="w-full h-screen">
                <Link to={`/products`} state={{ query: ele.path }}>
                  {ele.img ? (
                    <img src={ele.img || "/placeholder.svg"} alt={ele.img} className="w-full h-screen object-cover" />
                  ) : ele.video ? (
                    <video autoPlay loop muted controls={ele.cat !== "kids"} className="w-full h-screen object-cover">
                      <source src={ele.video} type="video/mp4" />
                    </video>
                  ) : null}
                </Link>
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
            <span>{category[indexNo - 1]}</span>
          </button>
        )}
        {indexNo < category.length - 1 && (
          <button
            onClick={handleNext}
            className={`flex items-center bg-transparent border-none font-light ml-auto ${
              activeIndex % 2 === 0 ? "text-white" : "text-black"
            }`}
          >
            <span>{category[indexNo + 1]}</span>
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        )}
      </div>
      {showFooter && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <FooterLP />
        </div>
      )}
    </div>
  )
}

export default Homepage

