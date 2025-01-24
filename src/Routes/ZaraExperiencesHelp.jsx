import React from 'react'
import DynamicRenderMap from '../Components/DynamicRenderMap'
import { zara_exp_map } from '../utils/constants'
import Footer from '../Components/Footer'

const ZaraExperiencesHelp = () => {
  return (
    <>
      <div className='w-[80%] mt-60 mx-auto font-aboutUs'>
        <DynamicRenderMap heading={'ZARA EXPERIENCES'} items={zara_exp_map} imgSrc={'https://static.zara.net/photos///contents/mkt/spots/aw22-help-customer/subhome-xmedia-experiences//w/725/landscape-15820052-2ac8-47ef-8193-0350ea31a8ca_0.jpg?ts=1672148129742'}/>
      </div>
      <Footer/>
    </>
  )
}

export default ZaraExperiencesHelp