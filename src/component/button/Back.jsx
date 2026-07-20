'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import { BiLeftArrow } from 'react-icons/bi'

const Back = () => {
    const {goBack}=useContext(Context)
  return (
    <div onClick={goBack} className='flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer'><BiLeftArrow/> Back</div>
  )
}

export default Back