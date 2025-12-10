// components/Carousel.js
import React from 'react';

const Carousel = () => {
  return (
    <div className="container mx-auto p-8 text-primary">

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4 mt-8">
      <div className="group hover:text-white card-container p-4 bg-bkg2 shadow-md rounded-md transform transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-mellowblue hover:to-darkmellowblue">
        <h2 className="text-xl font-semibold mb-2">Explore the World</h2>
        <p className="text-gray-600 group-hover:text-white">Breathtaking destinations and travel inspirations at a click</p>
      </div>
      <div className="group hover:text-white card-container p-4 bg-bkg2 shadow-md rounded-md transform transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-mellowgreen hover:to-darkmellowgreen">
        <h2 className="text-xl font-semibold mb-2">Master Your Mind</h2>
        <p className="text-gray-600 group-hover:text-white">Powerful tools and resources for mindfulness and self-improvement</p>
      </div>
      <div className="group hover:text-white card-container p-4 bg-bkg2 shadow-md rounded-md transform transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-mellowpurple hover:to-darkmellowpurple">
        <h2 className="text-xl font-semibold mb-2">Tech Trends Unleashed</h2>
        <p className="text-gray-600 group-hover:text-white">Stay ahead of the curve with innovative breakthroughs</p>
      </div>
      <div className="group hover:text-white card-container p-4 bg-bkg2 shadow-md rounded-md transform transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-mellowred hover:to-darkmellowred">
        <h2 className="text-xl font-semibold mb-2">Culinary Delights</h2>
        <p className="text-gray-600 group-hover:text-white">Journey into the world of gourmet marvels and culinary adventures</p>
      </div>
      <div className="group hover:text-white card-container p-4 bg-bkg2 shadow-md rounded-md transform transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-mellowturquoise hover:to-darkmellowturquoise">
        <h2 className="text-xl font-semibold mb-2">Fit for Life</h2>
        <p className="text-gray-600 group-hover:text-white">Fitness routines, wellness tips, and nutritional insights for a happier you</p>
      </div>

       
      </div>
    </div>
  );
};

export default Carousel;