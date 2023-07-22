import React, { useContext, useState } from 'react'

const ActiveUserContext = React.createContext()
const ActiveUserUpdateContext = React.createContext()

export function useActiveUser() {
  return useContext(ActiveUserContext)
}

export function useActiveUserUpdate() {
  return useContext(ActiveUserUpdateContext)
}

export function ActiveUserProvider({ children }) {
  const [activeUser, setActiveUser] = useState({username: '', password: '', 
  watchedmovies:[], recommendations:[]})

  

  function defineActiveUser( user ) {
    setActiveUser(user)
    //console.log(`user set: ${user.username}`)
  }

  return (
    <ActiveUserContext.Provider value={activeUser}>
      <ActiveUserUpdateContext.Provider value={defineActiveUser}>
        {children}
      </ActiveUserUpdateContext.Provider>
    </ActiveUserContext.Provider>
  )
}