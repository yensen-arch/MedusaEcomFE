import React from 'react'
import DynamicRenderMap from '../Components/DynamicRenderMap'
import { items_availability_map } from '../utils/constants'
import Footer from '../Components/Footer'

const ItemsAvailabilityHelp = () => {
  return (
    <>
      <div className='w-[80%] mt-48 mx-auto font-aboutUs'>
        <DynamicRenderMap items={items_availability_map} imgSrc={'https://static.zara.net/photos///contents/mkt/spots/aw22-help-customer/subhome-xmedia-items-sizes//w/725/landscape-96355a30-52cc-4411-86f6-4fcada393076_0.jpg?ts=1672218637303'}/>
      </div>
      <Footer/>
    </>
  )
}

export default ItemsAvailabilityHelp