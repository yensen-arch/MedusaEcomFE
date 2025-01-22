import React, { useState } from 'react'

const DynamicRenderMap = ({ items }) => {
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
        <div className='leftDiv w-2/5 flex flex-col gap-10'>
          <div className="upperLeft border-black border-[0.5px] p-10">
            <h2 className="mb-4 text-sm">ITEMS AND SIZES</h2>
            <ul>
              {Object.keys(items).map((key) => (
                <li
                  key={key}
                  className={`cursor-pointer py-2 text-xs rounded ${selectedKey === key ? "font-semibold" : ""} hover:underline`}
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
        <div className="rightDiv flex flex-col w-3/5 gap-10">
          <h2 className="text-xl">{selectedKey}</h2>
          <img src={'https://static.zara.net/photos///contents/mkt/spots/aw22-help-customer/subhome-xmedia-items-sizes//w/725/landscape-96355a30-52cc-4411-86f6-4fcada393076_0.jpg?ts=1672218637303'}/>
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