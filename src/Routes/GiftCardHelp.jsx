import React from 'react'
import DynamicRenderMap from '../Components/DynamicRenderMap';
import Footer from '../Components/Footer';
import { gift_card_help } from '../utils/constants';

const GiftCardHelp = () => {
  return (
    <>
      <div className='w-[80%] mt-48 mx-auto font-aboutUs'>
        <DynamicRenderMap items={gift_card_help} imgSrc={'https://static.zara.net/photos///contents/mkt/spots/aw22-help-customer/subhome-xmedia-gift-options//w/725/landscape-2c047da3-3511-4537-a03c-b0c9e57edd4c_0.jpg?ts=1672146698625'}/>
      </div>
      <Footer/>
    </>
  )
}

export default GiftCardHelp