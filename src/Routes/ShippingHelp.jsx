import React from 'react'
import DynamicRenderMap from '../Components/DynamicRenderMap'
import { shipping_map } from '../utils/constants'
import Footer from '../Components/Footer'

const ShippingHelp = () => {
  return (
    <>
      <div className='w-[80%] mt-48 mx-auto font-aboutUs'>
        <DynamicRenderMap items={shipping_map} imgSrc={'https://static.zara.net/photos///contents/mkt/spots/aw22-help-customer/subhome-xmedia-deliveries//w/725/landscape-e6935eda-b095-47e3-8538-87858b3999d1_0.jpg?ts=1672217471219'}/>
      </div>
      <Footer/>
    </>
  )
}

export default ShippingHelp