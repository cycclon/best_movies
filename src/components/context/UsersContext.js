import React, { useContext, useState } from 'react'

const UsersContext = React.createContext()
const UsersContextUpdate = React.createContext()

export function useUsers() {
  return useContext(UsersContext)
}

export function useUsersUpdate() {
  return useContext(UsersContextUpdate)
}

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([])

  function defineUsers( newUsers ) {
    setUsers(newUsers)
    //console.log(`user set: ${newUsers.length}`)
  }

  return (
    <UsersContext.Provider value={users}>
      <UsersContextUpdate.Provider value={defineUsers}>
        {children}
      </UsersContextUpdate.Provider>
    </UsersContext.Provider>
  )
}