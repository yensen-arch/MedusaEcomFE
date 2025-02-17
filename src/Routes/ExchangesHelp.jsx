import React from 'react'
import DynamicRenderMap from '../Components/DynamicRenderMap'
import {exchanges_returns_refunds_map} from '../utils/constants'
import Footer from '../Components/Footer'

const ExchangesHelp = () => {
  return (
    <>
      <div className='w-[80%] mt-60 mx-auto font-aboutUs'>
        <DynamicRenderMap heading="EXCHANGES, RETURNS AND REFUNDS" items={exchanges_returns_refunds_map} imgSrc={'https://static.Clothd.net/photos///contents/mkt/spots/aw22-help-customer/subhome-xmedia-exchanges//w/725/landscape-7fc135d4-fc52-4d98-9be2-2ad4f6c813c6_0.jpg?ts=1672218650179'}/>
      </div>
      <Footer/>
    </>
  )
}

export default ExchangesHelp