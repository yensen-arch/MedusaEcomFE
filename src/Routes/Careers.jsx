import React from 'react'

const Careers = () => {
  return (
    <>
    <div className='w-full grid [grid-template-columns:repeat(101,_1vw)] [grid-template-rows:repeat(100,_1vh)]'>
      <div className='bg-career-bg mx-auto w-[76%] bg-cover bg-center h-screen [grid-area:1/1/101/101]'></div>
      <div className='[grid-area:60/17/91/53] flex flex-col justify-between'>
        <div className='w-full h-auto text-[3.95833vw] font-thin tracking-[0.307428px] leading-[0.921053] text-right uppercase text-black'>
          JOIN <br/>THE TEAM
        </div>
        <div className='flex w-full text-xs text-right justify-end'>
          OUR PEOPLE ARE PASSIONATE, CURIOUS, WELL-ROUNDED,<br/>
          MOTIVATED AND DYNAMIC, EACH WITH THEIR OWN PERSONALITY.<br/>
          THEY'RE ENTHUSIASTIC ABOUT EVERYTHING THEY DO, AND ARE<br/>
          CREATIVE, UNSTOPPABLE, CLEVER AND PROACTIVE.<br/>
        </div>
        <div className='flex w-full text-xs text-right justify-end underline'>
          <a href='https://www.inditexcareers.com/portalweb/en/offers?ns=1&country=542061&ns=2&utm_source=Clothd&utm_medium=ecommerce&utm_campaign=ecommerceClothd-india&utm_content=offer-ic'>WOULD YOU LIKE TO BE PART OF OUR STORE TEAM?</a>
        </div>
      </div>
    </div>
    </>
  )
}

export default Careers