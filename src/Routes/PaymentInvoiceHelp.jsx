import React from 'react'
import DynamicRenderMap from '../Components/DynamicRenderMap'
import { payment_invoice_map } from '../utils/constants'
import Footer from '../Components/Footer'

const PaymentInvoiceHelp = () => {
  return (
    <>
      <div className='w-[80%] mt-60 mx-auto font-aboutUs'>
        <DynamicRenderMap heading={'PAYMENTS AND INVOICES'} items={payment_invoice_map} imgSrc={'https://static.Clothd.net/photos///contents/mkt/spots/aw22-help-customer/subhome-xmedia-payment//w/725/landscape-af9fbca9-3a2a-4fba-ba24-e80c1a950874_0.jpg?ts=1672146762412'}/>
      </div>
      <Footer/>
    </>
  )
}

export default PaymentInvoiceHelp