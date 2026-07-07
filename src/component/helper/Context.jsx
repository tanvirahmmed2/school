'use client'
import { createContext } from "react";




export const Context= createContext()

export const ContextProvider=({children})=>{

    const values={}
    return <Context.Provider value={values}>
        {children}
    </Context.Provider>
}