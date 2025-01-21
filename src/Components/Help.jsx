import React from 'react'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import { faqs, faqs2 } from '../utils/constants'
import { useState } from 'react'

const Help = () => {

  const [showAllStates, setShowAllStates] = useState(
    faqs2.map(() => false) // Initialize with `false` for each FAQ
  );
  const toggleShowAll = (index) => {
    setShowAllStates((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };
  return (
    <>
      <img className='w-[100%] mx-auto mt-40' src='https://static.zara.net/assets/public/96b3/0302/e44e4e019db2/65a192e9968c/image-landscape-web-60c40758-6e66-4050-a5e5-7a09d0374901-default_0/image-landscape-web-60c40758-6e66-4050-a5e5-7a09d0374901-default_0.jpg?ts=1737021733464&w=1263'></img>
      <div className="flex flex-col my-20 mx-auto w-[76%] gap-10">
        <div className='font-bold'>
          FREQUENTLY ASKED QUESTIONS
        </div>
        <div className='help-favourites-content'>
          <nav className="flex flex-wrap gap-3">
            {
              faqs.map((faq, index) => {
                return (
                  <a href={faq.link} className='border border-black text-[0.625rem] mr-10 px-2 py-1'>{faq.text}</a>
                )
              })
            }
          </nav>
        </div>
      </div>
      <div style={{ width: "76%", margin: "auto", cursor: 'pointer' }}>
        <h3 className='mb-5 font-bold'>ALL HELP TOPICS</h3>
        <div className="grid gap-5 grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))] max-w-[1440px]">
          {
            faqs2.map((faq, index) => {
              return (
                <div key={index} className='flex flex-col border border-black p-8'>
                  <h3 className='mb-5'>{faq.title}</h3>
                  <ul>
                    {
                      (showAllStates[index] ? faq.pointers : faq.pointers.slice(0, 3)).map((pointer, index) => {
                        return (
                          <li key={index} className='text-[0.625rem] mb-2 hover:cursor-pointer hover:underline'>
                            {pointer}
                          </li>
                        )
                      })
                    }
                  </ul>
                  {faq.pointers.length > 3 && (
                    <button
                      onClick={() => toggleShowAll(index)}
                      className="text-[0.625rem] mt-2 text-left underline"
                    >
                      {showAllStates[index] ? "View Less" : "View More"}
                    </button>
                  )}
                </div>
              )
            })
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Help
