
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
      <div className='mt-80 mx-auto w-[76%] flex flex-col gap-3'>
        <h2 className='text-[15px] font-semibold tracking-[0.8px] [font-stretch:condensed] font-aboutUs'>Our Mission</h2>
        <p className='text-[13px] font-aboutUs font-light leading-[20px]'>
          At Clothd, we believe in transforming the fashion industry through sustainable practices and innovative design.<br /><br />
          Our mission is to create clothing that not only looks good but does good. We're committed to ethical manufacturing,<br />
          sustainable materials, and reducing our environmental impact across our entire supply chain.<br /><br />
          Through our dedication to sustainability and style, we aim to prove that fashion can be both beautiful and responsible.<br />
          We work closely with our partners to ensure fair labor practices and maintain the highest standards of quality.
        </p>
      </div>
      <Footer />
    </>
  )
}

export default AboutUs