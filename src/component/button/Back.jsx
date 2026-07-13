'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import { BiLeftArrow } from 'react-icons/bi'

const Back = () => {
    const {goBack}=useContext(Context)
  return (
    <div onClick={goBack} className='w-full bg-slate-100 rounded-2xl flex flex-row items-center justify-center cursor-pointer gap-6 '><BiLeftArrow/> Back</div>
  )
}

export default Back