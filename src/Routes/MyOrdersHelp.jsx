import React from 'react'
import DynamicRenderMap from '../Components/DynamicRenderMap'
import { my_purchases_help_map } from '../utils/constants'
import Footer from '../Components/Footer'

const MyOrdersHelp = () => {
  return (
    <>
      <div className='w-[80%] mt-60 mx-auto font-aboutUs'>
        <DynamicRenderMap heading={'MY PURCHASES'} items={my_purchases_help_map} imgSrc={'https://static.Clothd.net/photos///contents/mkt/spots/aw22-help-customer/subhome-xmedia-purchases//w/725/landscape-1e069b8a-173e-4b23-bbdd-1f6705ad9282_0.jpg?ts=1672218488792'}/>
      </div>
      <Footer/>
    </>
  )
}

export default MyOrdersHelp