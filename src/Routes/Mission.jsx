
import React, { useState } from 'react'
import Footer from '../Components/Footer'

const AboutUs = () => {
  const [email, setEmail] = useState("")
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (e.target.value.length > 0 && !showAdditionalFields) {
      setShowAdditionalFields(true)
    } else if (e.target.value.length === 0 && showAdditionalFields) {
      setShowAdditionalFields(false)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", { email })
  }
  return (
    <>
      <div className='mt-40 mb-[500px] mx-auto w-[76%] flex flex-col gap-3'>
        <h2 className='text-[15px] font-semibold tracking-[0.8px] [font-stretch:condensed] font-aboutUs'>Our Mission</h2>
        <p className='text-[13px] font-aboutUs font-light leading-[20px]'>
          At Clothd, we aim to foster a community by supplying sustainable, high-quality clothing and cultivating 
          change for the less fortunate with a donation from each sale.<br /><br />
        </p>
      </div>
      <Footer />
    </>
  )
}

export default AboutUs