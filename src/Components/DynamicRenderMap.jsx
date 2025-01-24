import React, { useState } from 'react'

const DynamicRenderMap = ({ items, imgSrc, heading }) => {
  const renderHTML = (content) => {
    if (typeof content === "string") {
      return <div dangerouslySetInnerHTML={{ __html: content }} />
    }
    return content
  }
  const [selectedKey, setSelectedKey] = useState(Object.keys(items)[0])
  return (
    <>
      <div className='flex gap-32'>
        <div className='leftDiv w-[25%] flex flex-col gap-10'>
          <div className="upperLeft border-black border-[0.5px] p-10">
            <h2 className="mb-4 text-sm">{heading}</h2>
            <ul>
              {Object.keys(items).map((key) => (
                <li
                  key={key}
                  className={`cursor-pointer py-2 text-[0.625rem] leading-[1.5] tracking-wider rounded ${selectedKey === key ? "font-semibold" : ""} hover:underline`}
                  onClick={() => setSelectedKey(key)}
                >
                  {key}
                </li>
              ))}
            </ul>
          </div>
          <div className='border-black border-[0.5px] p-2 text-xs flex items-center justify-center'>
              <input type='text' className='border-none w-full focus:border-none' placeholder='SEARCH IN THE SHOPPING GUIDE'/>
          </div>
        </div>
        <div className="rightDiv flex flex-col w-[50%] gap-10">
          <h2 className="text-xl leading-[1.5] tracking-wider">{selectedKey}</h2>
          {imgSrc ? (
            <img src={imgSrc}/>
          ) : null}
          {selectedKey ? (
            renderHTML(items[selectedKey])
          ) : (
            <p className="text-gray-500">Select an item to view its content</p>
          )}
        </div>
      </div>
    </>
  )
}

export default DynamicRenderMap