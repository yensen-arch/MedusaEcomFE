import React, { useState, useEffect } from "react";
import { param_key_match } from "../utils/constants";
import { Link, useSearchParams } from "react-router-dom";

const DynamicRenderMap = ({ items, imgSrc, heading }) => {
  const renderHTML = (content) => {
    if (typeof content === "string") {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return content;
  };

  const [searchParam] = useSearchParams();
  const keyFromParams = searchParam.get("key");
  const [selectedKey, setSelectedKey] = useState(() => {
    const matchedKey = param_key_match[keyFromParams];
    return matchedKey && items[matchedKey] ? matchedKey : Object.keys(items)[0];
  });

  useEffect(() => {
    const matchedKey = param_key_match[keyFromParams];
    setSelectedKey(matchedKey && items[matchedKey] ? matchedKey : Object.keys(items)[0]);
    window.scrollTo(0,0);
  }, [keyFromParams, items]);

  return (
    <>
      <div className='flex justify-center md:gap-32'>
        <div className='leftDiv hidden w-[25%] md:flex flex-col gap-10'>
          <div className="text-[0.6rem] underline">
            <Link to={'/help'}>Back to Help</Link>
          </div>
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
        <div className="rightDiv flex flex-col w-[100%] md:w-[50%] gap-10">
          <a className='text-xs md:hidden underline' href='/help'> &lt;- Shopping Guide</a>
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