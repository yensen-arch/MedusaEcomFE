
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
        <h2 className='text-[15px] font-semibold tracking-[0.8px] [font-stretch:condensed] font-aboutUs'>Company</h2>
        <p className='text-[13px] font-aboutUs font-light leading-[20px]'>
          Clothd is one of the largest international fashion companies. It belongs to Inditex, one of the world’s largest distribution groups.<br /><br />
          The customer is at the heart of our unique business model, which includes design, production, distribution and sales through<br />our extensive retail network.<br /><br />
          For more information, please visit the Inditex Group website: <a href='https://www.inditex.com'>www.inditex.com</a>
        </p>
      </div>
      <div className="mt-10 mx-auto w-[76%] py-12">
        <div className="mt-40">
          <h2 className="font-light font-aboutUs mb-4">JOIN OUR NEWSLETTER</h2>
          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {showAdditionalFields && (
              <>
                <div className="flex items-center space-x-2 font-aboutUs font-light">
                  <input type="checkbox" id="terms" className="rounded text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="terms" className="text-sm">
                    I accept the terms and conditions
                  </label>
                </div>
                <div>
                  <p className="text-sm mb-2">Select your interests:</p>
                  <div className="grid  gap-2">
                    {["Woman", "Man", "Kids", "Beauty"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={option.toLowerCase()}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={option.toLowerCase()} className="text-sm">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutUs