import React, { useContext, useState } from 'react'

const LoadingContext = React.createContext()
const LoadingUpdateContext = React.createContext()

export function useLoading() {
  return useContext(LoadingContext)
}

export function useLoadingUpdate() {
  return useContext(LoadingUpdateContext)
}

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)

  

  function defineIsLoading( isL ) {
    setIsLoading(isL)
    //console.log(`user set: ${user.username}`)
  }

  return (
    <LoadingContext.Provider value={isLoading}>
      <LoadingUpdateContext.Provider value={defineIsLoading}>
        {children}
      </LoadingUpdateContext.Provider>
    </LoadingContext.Provider>
  )
}