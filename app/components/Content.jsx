// components/Content.js
import Image from "next/image";
import React from "react";

const Content = ({ imageSrc, altText, paragraphText, Item, className }) => {
  return (
    <div className="bg-secondary rounded-lg shadow-md p-4 m-4 flex flex-col items-center ${className}">
      <h1 className="text-primary text-base mb-1">{Item}</h1>
      <div className="flex flex-row items-center">
        <div className="flex-shrink-0 w-28">
          <Image src={imageSrc} alt={altText} className="rounded-sm h-auto" />
        </div>
        <div className="flex-grow overflow-auto p-2 m-1 h-40 sm:w-1/2">
          <p className="text-primary">{paragraphText}</p>
        </div>
      </div>
    </div>
  );
};

export default Content;
