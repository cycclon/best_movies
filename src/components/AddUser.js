import { toast } from "react-toastify"
import { useUsers } from "./context/UsersContext"
import { useState, useRef } from 'react'
import { useUsersUpdate } from "./context/UsersContext"
import { useContext } from "react"

const AddUser = ({ setNewUserForm, setUsername }) => {
  const DATASERVER_ADDR = process.env.REACT_APP_USERS_MS
  const setUsers = useUsersUpdate()
  const users = useUsers()
  const [ username, setNewUsername ] = useState('')
  const passwordRef = useRef()
  const passwordDuplicateRef = useRef()
  const [ available, setAvailable ] = useState(true)
  const [ adding, setAdding] = useState(false)

  const addUser = async (e) => {
    e.preventDefault()
    setAdding(true)

    if(passwordRef.current.value !== passwordDuplicateRef.current.value) {
      toast.error('The password does not match the confirmation')
      setAdding(false)
      return
    }

    if(!username){
      toast.error('You must choose a username')
      setAdding(false)
      return
    }

    if(!available){
      toast.error('The selected username is not available')
      setAdding(false)
      return
    }

    if(!passwordRef.current.value){
      toast.error('You must enter a password')
      setAdding(false)
      return
    }

    

    const res = await fetch(DATASERVER_ADDR + '/users',
      {method: 'POST',
      mode: 'cors', 
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ username: username, password: passwordRef.current.value})
    })

    const newUser = await res.json()
    setUsers([...users, newUser])

    toast.success('User created!')
    setAdding(false)
    
    setUsername(username)

    setNewUsername('')
    passwordRef.current.value = ''
    passwordDuplicateRef.current.value = ''
    setNewUserForm(false)
  }

  

  const usernameChanged = (e)=>{
    setNewUsername(e.target.value)
    if(username){
      setAvailable(!users.find((u)=>u.username === e.target.value))
    }
  }

  const showMessage = ()=>{
    let message
    if(available && username){message = 'Username available'}
    if(!username){message = ''}
    if(!available && username){message = 'Username NOT Available'}
    return message
  }

  return (
    <form onSubmit={addUser}>
      <div className="adduser-form">
        <h3>Add user</h3>
        <br />
        { showMessage() }
        <br /> 
        <label className="form-label" style={{width: "150px", display: "inline-block", textAlign: "right"}}>Desired username:</label>
        <input disabled={adding} className="form-textbox" type="text" value={username} onChange={(e)=>usernameChanged(e)} />
        <br />
        <label className="form-label" style={{width: "150px", display: "inline-block", textAlign: "right"}}>Password:</label>
        <input disabled={adding} className="form-textbox" type="password" ref={passwordRef}  />
        <br />
        <label className="form-label" style={{width: "150px", display: "inline-block", textAlign: "right"}}>Repeat password:</label>
        <input disabled={adding} className="form-textbox" type="password" ref={passwordDuplicateRef} />
        <br />
        <br />
        <button disabled={adding} className="btn btn-bottom" onClick={()=>{setNewUserForm(false)}}>Cancel</button>
        <input disabled={adding} type="submit" value={adding ? 'Creating user...' : 'Create user'} className=" btn btn-bottom" />
      </div>
    </form>
  )
}

export default AddUser