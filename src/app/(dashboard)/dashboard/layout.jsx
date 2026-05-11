import React from 'react'
export const metadata={
    title:'Dashboard | School',
    description:'School Dashboard'
}
const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
