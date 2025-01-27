import LogIn from '../Routes/LogIn'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Help from '../Components/Help'
import SignIn from '../Routes/SignIn'
import SinglePage from '../Components/SinglePage'
import ProductPage from '../Routes/ProductPage'
import Homepage from './Homepage'
import Cart from '../Components/Cart'
import Checkout from '../Components/Checkout'
import PaymentMethod from '../Components/PaymentMethod'
import Search from '../Components/Search'
import CardDetail from '../Routes/CardDetail'
import AboutUs from './AboutUs'
import OTP from './OTP'
import Careers from './Careers'
import NewsLetter from './NewsLetter'
import ProtectedRoute from '../Components/ProtectedRoute'
import ItemsAvailabilityHelp from './ItemsAvailabilityHelp'
import GiftCardHelp from './GiftCardHelp'
import ShippingHelp from './ShippingHelp'
import PaymentInvoiceHelp from './PaymentInvoiceHelp'
import MyOrdersHelp from './MyOrdersHelp'
import ExchangesHelp from './ExchangesHelp'
import ZaraExperiencesHelp from './ZaraExperiencesHelp'
import Privacy from './Privacy'
const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Homepage />}></Route>
      <Route path='/product/:id' element={<SinglePage />}></Route>
      <Route path='about' element={<AboutUs />}></Route>
      <Route path='/help' element={<Help />}></Route>
      <Route path='newsletter' element={<NewsLetter />}></Route>
      <Route path='/login' element={<LogIn />} />
      <Route path='/help/items-and-sizes' element={<ItemsAvailabilityHelp />}></Route>
      <Route path='/help/gift-card' element={<GiftCardHelp />}></Route>
      <Route path='/help/shipping' element={<ShippingHelp/>}></Route>
      <Route path='/help/payment-invoice' element={<PaymentInvoiceHelp />}></Route>
      <Route path='/help/zara-experiences' element={<ZaraExperiencesHelp/>}></Route>
      <Route path='/help/exchanges' element={<ExchangesHelp />}></Route>
      <Route path='/help/myOrders' element={<MyOrdersHelp />}></Route>
      <Route path='/signin' element={<SignIn />} />
      <Route path='career' element={<Careers />}></Route>
      <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>}></Route>
      <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>}></Route>
      <Route path='/paymentMethod' element={ <ProtectedRoute><PaymentMethod /></ProtectedRoute>}></Route>
      <Route path='/products' element={<ProductPage />}></Route>
      <Route path='/search' element={<Search />}></Route>
      <Route path='/privacy' element={<Privacy />}></Route>
      <Route path='/fillcarddetail' element={<ProtectedRoute><CardDetail /></ProtectedRoute>}></Route>
      <Route path='/otp' element={<ProtectedRoute><OTP /></ProtectedRoute>}></Route>
    </Routes>
  )
}

export default AllRoutes