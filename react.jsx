import React, { useState, useEffect, useRef } from 'react';

export default function PixelElevator() {
  const [floor, setFloor] = useState(1);
  const [bgOffset, setBgOffset] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState(null); // 'up', 'down', or null

  // Use a ref for the interval to avoid stale state issues in closures
  const intervalRef = useRef(null);

  // This effect ensures that any running interval is cleared when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Handles all elevator movement logic.
   * @param {number} targetFloor - The destination floor.
   */
  const goToFloor = (targetFloor) => {
    // Prevent movement if already moving, at the target floor, or out of bounds
    if (isMoving || targetFloor === floor || targetFloor < 1 || targetFloor > 10) {
      return;
    }

    const currentFloor = floor;
    const floorsToTravel = Math.abs(targetFloor - currentFloor);
    // Travel time is now proportional to the number of floors, making it more realistic
    const travelTime = floorsToTravel * 2000; // 2 seconds per floor

    setIsMoving(true);
    
    // Determine the direction for background scrolling and the arrow indicator
    const moveDirection = targetFloor > currentFloor ? 'up' : 'down';
    setDirection(moveDirection);
    
    const scrollAmount = moveDirection === 'up' ? -3 : 3;

    // Clear any lingering intervals before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start the background scrolling animation
    intervalRef.current = setInterval(() => {
      setBgOffset(prev => prev + scrollAmount);
    }, 20);

    // After the calculated travel time, stop the movement and update the floor
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsMoving(false);
      setDirection(null);
      // Update the floor number *after* the elevator has arrived
      setFloor(targetFloor);
    }, travelTime);
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center font-sans p-4">
      <div className="relative">
        {/* Elevator outer frame */}
        <div className="relative w-[450px] h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 border-8 border-gray-700 shadow-2xl rounded-lg">
          
          {/* Elevator interior */}
          <div className="absolute inset-4 bg-gradient-to-b from-gray-700 to-gray-800 overflow-hidden rounded">
            
            {/* Ceiling */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-600 to-gray-700 border-b-2 border-gray-800">
              {/* Ceiling light */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-yellow-200 border-2 border-yellow-400 shadow-lg rounded" 
                   style={{ boxShadow: '0 0 30px rgba(255, 255, 150, 0.8)' }}>
                <div className="w-full h-full bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-sm"></div>
              </div>
              {/* Ceiling vent */}
              <div className="absolute top-2 right-4 flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1 h-6 bg-gray-800"></div>
                ))}
              </div>
            </div>

            {/* Floor display (below ceiling) */}
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-black px-8 py-3 border-4 border-gray-800 shadow-lg rounded">
                <div className="text-red-500 text-5xl font-bold font-mono" 
                     style={{ textShadow: '0 0 15px #ff0000, 0 0 30px #ff0000' }}>
                  {floor}
                </div>
              </div>
              {/* Directional arrow display */}
              {isMoving && direction && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-green-400 text-2xl animate-pulse">
                  {direction === 'up' ? '▲' : '▼'}
                </div>
              )}
            </div>

            {/* Window (where background is visible) */}
            <div className="absolute top-24 left-8 right-8 bottom-24 bg-sky-400 overflow-hidden border-8 border-gray-800 shadow-inner rounded">
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Moving background */}
              <div 
                className="absolute w-full h-[300%]" // Increased height for more seamless looping
                style={{ 
                  top: `${-bgOffset % 1000}px`,
                  imageRendering: 'pixelated'
                }}
              >
                {[0, 1, 2].map((section) => (
                  <div key={section} className="relative h-[1000px]">
                    {/* Sky background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-blue-300"></div>
                    
                    {/* Sun */}
                    <div
                      className="absolute w-16 h-16 bg-yellow-300 rounded-full"
                      style={{
                        right: '40px',
                        top: '80px', // Simplified position, as it's part of a repeating section
                        boxShadow: '0 0 40px rgba(255, 255, 0, 0.8)'
                      }}
                    />
                    
                    {/* Clouds */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`cloud-${section}-${i}`}
                        className="absolute"
                        style={{
                          left: `${(i * 60 + section * 30) % 350}px`,
                          top: `${100 + i * 120}px`,
                        }}
                      >
                        <div className="relative">
                          <div className="w-10 h-6 bg-white rounded-full opacity-90"></div>
                          <div className="absolute -top-1 left-2 w-14 h-8 bg-white rounded-full opacity-90"></div>
                          <div className="absolute top-0 right-0 w-8 h-6 bg-white rounded-full opacity-90"></div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Buildings */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={`building-${section}-${i}`}
                        className="absolute bottom-0 bg-purple-900"
                        style={{
                          left: `${i * 70}px`,
                          width: '60px',
                          height: `${100 + (i % 4) * 60}px`,
                          boxShadow: 'inset -3px 0 0 0 rgba(0,0,0,0.4)'
                        }}
                      >
                        <div className="grid grid-cols-2 gap-1 p-1">
                          {[...Array(12)].map((_, w) => (
                            <div key={w} className="w-3 h-3 bg-yellow-300"></div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Birds */}
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={`bird-${section}-${i}`}
                        className="absolute text-lg text-gray-700"
                        style={{
                          left: `${(i * 80 + 30 + section * 50) % 380}px`,
                          top: `${200 + i * 150}px`,
                        }}
                      >
                        <span>v</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Window frame (cross structure) */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-800 transform -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-800 transform -translate-x-1/2 pointer-events-none"></div>
            </div>

            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-800 to-gray-700 border-t-2 border-gray-600">
              {/* Floor tile pattern */}
              <div className="flex h-full">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`flex-1 border-r border-gray-600 ${i % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}`}></div>
                ))}
              </div>
            </div>

            {/* Coconut character */}
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-10" 
                 style={{ 
                   animation: isMoving ? 'bounce 0.5s infinite' : 'none',
                   imageRendering: 'pixelated' 
                 }}>
              <div className="relative">
                {/* Coconut body */}
                <div className="relative">
                  <div className="w-28 h-32 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full border-4 border-amber-950 mx-auto shadow-lg">
                    {/* Coconut texture dots */}
                    <div className="absolute top-4 left-4 w-4 h-4 bg-amber-950 rounded-full"></div>
                    <div className="absolute top-10 right-5 w-3 h-3 bg-amber-950 rounded-full"></div>
                    <div className="absolute bottom-8 left-6 w-3 h-3 bg-amber-950 rounded-full"></div>
                    <div className="absolute bottom-12 right-7 w-4 h-4 bg-amber-950 rounded-full"></div>
                    <div className="absolute top-16 left-10 w-2 h-2 bg-amber-950 rounded-full"></div>
                  </div>
                  
                  {/* Face */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-24 h-20">
                    {/* Eyes */}
                    <div className="absolute top-3 left-4 w-5 h-5 bg-black rounded-full border-2 border-gray-800"><div className="absolute top-0.5 right-1 w-2 h-2 bg-white rounded-full"></div></div>
                    <div className="absolute top-3 right-4 w-5 h-5 bg-black rounded-full border-2 border-gray-800"><div className="absolute top-0.5 right-1 w-2 h-2 bg-white rounded-full"></div></div>
                    {/* Mouth */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-5 border-b-4 border-black rounded-full"></div>
                    {/* Cheeks */}
                    <div className="absolute bottom-5 left-2 w-4 h-4 bg-pink-400 rounded-full opacity-70"></div>
                    <div className="absolute bottom-5 right-2 w-4 h-4 bg-pink-400 rounded-full opacity-70"></div>
                  </div>
                </div>
                
                {/* Arms - Fixed non-standard border-3 to border-4 */}
                <div className="absolute top-14 -left-7 w-6 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full border-4 border-amber-950 shadow"></div>
                <div className="absolute top-14 -right-7 w-6 h-14 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full border-4 border-amber-950 shadow"></div>
                
                {/* Legs */}
                <div className="flex gap-4 justify-center mt-2">
                  <div className="w-7 h-12 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full border-4 border-amber-950 shadow"></div>
                  <div className="w-7 h-12 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full border-4 border-amber-950 shadow"></div>
                </div>
              </div>
            </div>

            {/* Left wall button panel */}
            <div className="absolute top-32 left-4 bg-gradient-to-b from-gray-800 to-gray-900 p-4 border-4 border-gray-700 shadow-lg z-10 rounded">
              {/* Up button */}
              <button
                onClick={() => goToFloor(floor + 1)}
                disabled={isMoving || floor >= 10}
                className="w-14 h-14 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 disabled:from-gray-600 disabled:to-gray-700 border-4 border-green-700 disabled:border-gray-800 mb-3 flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-all rounded active:shadow-inner"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                ▲
              </button>
              
              {/* Down button */}
              <button
                onClick={() => goToFloor(floor - 1)}
                disabled={isMoving || floor <= 1}
                className="w-14 h-14 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 disabled:from-gray-600 disabled:to-gray-700 border-4 border-red-700 disabled:border-gray-800 flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-all rounded active:shadow-inner"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                ▼
              </button>

              {/* Emergency bell */}
              <div className="mt-4 pt-3 border-t-2 border-gray-700">
                <div className="w-14 h-14 bg-gradient-to-b from-yellow-500 to-orange-500 border-4 border-yellow-700 flex items-center justify-center text-white font-bold text-xs rounded shadow-lg">
                  BELL
                </div>
              </div>
            </div>

            {/* Moving indicator */}
            {isMoving && (
              <div className="absolute top-28 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-5 py-2 border-4 border-yellow-600 animate-pulse z-20 rounded shadow-lg">
                <div className="text-black font-bold text-sm">MOVING...</div>
              </div>
            )}
          </div>

          {/* Inner shadow for door frame effect */}
          <div className="absolute inset-0 border-4 border-transparent pointer-events-none shadow-inner rounded-lg"></div>
        </div>

        {/* Replaced <style jsx> with a standard <style> tag for better compatibility */}
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, -5px); }
          }
        `}</style>
      </div>
    </div>
  );
}

