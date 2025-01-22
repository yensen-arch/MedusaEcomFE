import React from 'react'
import DynamicRenderMap from '../Components/DynamicRenderMap'
import { items_availability_map } from '../utils/constants'
import Footer from '../Components/Footer'

const ItemsAvailabilityHelp = () => {
  return (
    <>
      <div className='w-[80%] mt-48 mx-auto font-aboutUs'>
        <DynamicRenderMap items={items_availability_map} />
      </div>
      <Footer/>
    </>
  )
}

export default ItemsAvailabilityHelp