import React from 'react'

const BlurCircle = ({ 
  top = "auto", 
  left = "auto", 
  right = "auto", 
  bottom = "auto", 
  color = "bg-orange-200",
  size = "h-[400px] w-[400px]"
}) => {
  return (
    <div 
      className={`absolute -z-10 rounded-full blur-[100px] opacity-70 pointer-events-none ${size} ${color}`}
      style={{
        top: top, 
        left: left, 
        right: right, 
        bottom: bottom,
        transform: 'translate3d(0,0,0)' // Forces hardware acceleration for smoother blur
      }}
    />
  )
}

export default BlurCircle