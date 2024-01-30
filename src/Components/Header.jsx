import React from 'react'

const Header = () => {
  return (
    <header className='bg-slate-200 h-20 flex items-center justify-center'>
      <h1 className='font-sans font-extrabold text-xl sm:text-3xl lg:text-6xl flex flex-wrap'>
        <span className='text-amber-500'>Wind</span>
        <span className='text-sky-500'>Whisper</span>
      </h1>
    </header>
  )
}

export default Header