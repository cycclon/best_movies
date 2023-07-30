// REACT IMPORTS
import { useState, useEffect, useRef, lazy, Suspense } from "react"

// LIBRARY IMPORTS
import { toast } from 'react-toastify'

// CONTEXT IMPORTS
import { useActiveUserUpdate } from "./context/ActiveUserContext"
import Loading from "./Loading"

// COMPONENT IMPORTS
//import AddUser from "./AddUser"

const AddUser = lazy(()=> import('./AddUser'))

const Login = ( { showLogin, setShowLogin }) => {
  const usernameRef = useRef()
  const passwordRef = useRef()
  const rememberMeRef = useRef()
  const rememberMeLabel = useRef()
  const [ newUserForm, setNewUserForm ] = useState(false)
  const ActiveUserUpdate = useActiveUserUpdate()
  const DATASERVER_ADDR = process.env.REACT_APP_USERS_MS
  const [ logginIn, setLogginIn ] = useState(false)
  const modal = useRef()  

  useEffect(()=>{
    function handleCloseEvent(e) {
      if(showLogin){setShowLogin(false)}
    }

    modal.current.removeAttribute('open')
    modal.current.addEventListener("close", e => handleCloseEvent(e))
    
    return ()=>{
      if(modal.current !== null){
        modal.current.removeEventListener("close", e => handleCloseEvent(e))
      }
      
    }    
  }, [])

  useEffect(()=>{
    if(showLogin){      
      modal.current.showModal()
    } else {
      modal.current.close()
    }
  },[showLogin])

  const login = async ()=>{
    setLogginIn(true)

    if(usernameRef.current.value === '' || passwordRef.current.value === ''){
      toast.error('You must enter a username and password')
      setLogginIn(false)
      return
    }
   
    const result = await fetch(
      DATASERVER_ADDR + `/users/validatepwd/${usernameRef.current.value}`,
         {method: 'POST',
          
          mode: 'cors', 
         headers: { "Content-Type": "application/json"},
         body: JSON.stringify({ password: passwordRef.current.value})})
         
    const resultJson = await result.json()
    console.log("🚀 ~ file: Login.js:72 ~ login ~ resultJson:", resultJson)   

    if(resultJson.validated){
      toast.success('Login successful!')

      // GET USER BY USERNAME
      const res = await fetch(DATASERVER_ADDR + `/users/username/${usernameRef.current.value}`, {mode: 'cors'})
      const user = await res.json()

      sessionStorage.setItem("userID", user._id)
      if(rememberMeRef.current.value){localStorage.setItem(
        "userID", user._id)}
      ActiveUserUpdate(user)
      setShowLogin(false)
    } else {
      toast.error("Username and/or password are incorrect")
      usernameRef.current.value = ''
      passwordRef.current.value = ''      
    }

    setLogginIn(false)
  }

  const setUsername = (name)=>{
    usernameRef.current.value = name
  }

  return (
    <dialog ref={modal} className="modal">
      <div className="login">
        <h3>LOGIN</h3>
        <div className="login-form" style={{paddingBottom: "10px"}}>
          <label className="form-label" >Username:</label>
          <input type="text" className="form-textbox" ref={usernameRef} disabled={logginIn} />
          <br />
          <label className="form-label" style={{width: "200px", textAlign: "right"}} >Password:</label>
          <input disabled={logginIn} type="password" className="form-textbox" ref={passwordRef} onKeyUp={(e)=>{
            if(e.key === 'Enter') {
              e.preventDefault()
              login()
            }
          }} />
          <br />
          
          <label ref={rememberMeLabel}><input type="checkbox" ref={rememberMeRef}  />Remember me on this device</label>
        </div>
        <label style={{width: "200px", textAlign: "right"}}>Not registered? </label>
        <button className="btn-link" onClick={()=>setNewUserForm(true)} disabled={logginIn}>Create new user</button>
        <div className="buttons-wrapper">
          <button className="btn btn-bottom" onClick={()=>setShowLogin(false)} disabled={logginIn}>Cancel</button>
          <button className="btn btn-bottom" onClick={()=>login()} disabled={logginIn}>{logginIn ? 'Loggin in...' : 'Login'}</button>
        </div>
      </div>    

      <Suspense fallback={<Loading />} >
        { newUserForm && <AddUser setNewUserForm={setNewUserForm} setUsername={setUsername} />}  
      </Suspense>
    </dialog>
  )
}

export default Login
