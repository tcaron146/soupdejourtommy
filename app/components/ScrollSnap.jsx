import React from "react";
import Image from "next/image";
// components/ScrollSnap.js
const ScrollSnap = () => {
  return (
    <div className="px-11 py-11">
      <div className="not-prose relative bg-gradient-to-r from-pinkish to-tertiary rounded-xl">
        <div
          className="absolute inset-0 bg-grid-slate-100 "
          style={{ backgroundPosition: "10px 10px" }}
        />
        <div className="relative rounded-xl">
          <div className="relative">
            <div className="flex ml-[50%] items-end justify-start pt-10 mb-6"></div>
            <div className="relative w-full flex gap-6 snap-x snap-mandatory overflow-x-scroll pb-14">
              <div className="snap-center shrink-0">
                <div className="shrink-0 w-4 sm:w-48" />
              </div>
              <div className="snap-center shrink-0">
                <Image
                  src="/pic1.jpg"
                  className="z-900 shrink-0 w-80 h-40 rounded-lg drop-shadow-xl transition ease-in duration-200 hover:-translate-y-1 hover:scale-110" alt="Image" width={20} height={20} 
                />
              </div>
              <div className="snap-center shrink-0">
                <Image
                  className="shrink-0 w-80 h-40 rounded-lg drop-shadow-xl transition ease-in duration-200 hover:-translate-y-1 hover:scale-110"
                  src="/pic2.jpg" alt="Image" width={20} height={20}
                />
              </div>
              <div className="snap-center shrink-0">
                <Image
                  className="shrink-0 w-80 h-40 rounded-lg drop-shadow-xl transition ease-in duration-200 hover:-translate-y-1 hover:scale-110"
                  src="/pic3.jpg" alt="Image" width={20} height={20}
                />
              </div>
              <div className="snap-center shrink-0">
                <Image
                  className="shrink-0 w-80 h-40 rounded-lg drop-shadow-xl transition ease-in duration-200 hover:-translate-y-1 hover:scale-110"
                  src="/pic4.jpg" alt="Image" width={20} height={20}
                />
              </div>
              <div className="snap-center shrink-0">
                <Image
                  className="shrink-0 w-80 h-40 rounded-lg drop-shadow-xl transition ease-in duration-200 hover:-translate-y-1 hover:scale-110"
                  src="/pic5.jpg" alt="Image" width={20} height={20}
                />
              </div>
              <div className="snap-center shrink-0">
                <Image
                  className="shrink-0 w-80 h-40 rounded-lg drop-shadow-xl transition ease-in duration-200 hover:-translate-y-1 hover:scale-110"
                  src="/pic6.jpg" alt="Image" width={20} height={20}
                />
              </div>
              <div className="snap-center shrink-0">
                <div className="shrink-0 w-4 sm:w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollSnap;
