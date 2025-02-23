import React, { useState } from 'react'

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleInterestChange = (interest) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !acceptTerms) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('https://mail.clothd.co/api/v1/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer W4zfWnJj9kcpMXfr6U23kJICVknttlOH26a0zkZZX2COJRrI1s3TCm2KWyUX'
        },
        body: JSON.stringify({
          EMAIL: email,
          INTERESTS: interests.join(','),
          ACCEPTS_MARKETING: acceptTerms
        })
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setEmail("");
      setInterests([]);
      setAcceptTerms(false);
      alert("Successfully subscribed to newsletter!");
    } catch (err) {
      setError("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleUnsubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  }
  return (
    <div className='w-[80%] mt-60 mx-auto font-aboutUs flex gap-10'>
      <div className='w-3/5'>
        <div className='flex flex-col gap-2'>
          <h4 className="font-100">NEWSLETTER</h4>
          <p className='text-[0.7rem] leading-[1rem]'>
            Select your interests and receive the latest news and trends every week. <br />
            Select Subscribe to confirm your preferences or Unsubscribe to remove yourself from the list.
          </p>
        </div>
        <div className='mt-20 text-[0.8rem]'>
          <form>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="w-full max-w-md px-3 py-2 border border-gray-300 focus:outline-none"
              required
            />
            <div className="flex items-center space-x-2 font-aboutUs font-light mt-8">
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500" 
              />
              <label htmlFor="terms" className="text-[0.8rem]">
                I accept the terms and conditions
              </label>
            </div>
            <div className='flex flex-col gap-2 mt-8'>
              <p className="text-[0.8rem] mb-2">Select your interests:</p>
              <div className="flex flex-col gap-8">
                {["Woman", "Man", "Kids", "Beauty"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={option.toLowerCase()}
                      checked={interests.includes(option)}
                      onChange={() => handleInterestChange(option)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={option.toLowerCase()} className="text-[0.8rem]">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className='my-16 flex flex-col gap-8 w-[50%]'>
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="text-black px-6 py-2 border-[0.5px] border-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
              <button
                onClick={handleUnsubscribe}
                className="bg-white text-black px-6 py-2  border-[0.5px] border-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Unsubscribe
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden md:block w-full lg:w-2/5 h-full">
        <video
          src="https://res.cloudinary.com/dmjhto8sd/video/upload/q_auto:best,f_auto/v1739850601/B444A4EE-6BBA-437C-947E-155D4BE435FD_xrt6pf.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="w-max object-fill"
          preload="auto"
        />
      </div>
    </div>
  )
}

export default NewsLetter