// REACT IMPORTS
import { useEffect, useContext, useState, useRef, lazy, Suspense } from 'react'

import { StarIcon, HomeIcon, ArrowTrendingUpIcon, CreditCardIcon, QuestionMarkCircleIcon   } from '@heroicons/react/24/outline'
import { useActiveUser, useActiveUserUpdate } from './context/ActiveUserContext'
import { toast } from 'react-toastify'

//import Login from './Login'

// CONTEXT IMPORTS
import { useLoading } from './context/LoadingContext'
import { Link } from 'react-router-dom'
import Loading from './Loading'

const Login = lazy(()=> import('./Login'))

const Header = ({ showLogin, setShowLogin } ) => {
  const ActiveUser = useActiveUser()
  const setActiveUser = useActiveUserUpdate()
  const isLoading = useLoading()
  const DATASERVER_ADDR = process.env.REACT_APP_USERS_MS
  const [hambOpen, setHambOpen] = useState(false)
  const hamb = useRef()
  const mainMenu = useRef()


  useEffect(()=>{
    // check if local or session storage contains a userID field and the active user is not set
    if((localStorage.getItem("userID") || sessionStorage.getItem("userID"))&&ActiveUser.username === "")
    {
      const getUser = async ()=>{

        let usrID
        if(sessionStorage.getItem("userID")) {usrID = sessionStorage.getItem("userID")}
        else {usrID = localStorage.getItem("userID")}
    
        const res = await fetch(DATASERVER_ADDR+`/users/${usrID}`,
          {mode: 'cors'})
    
        const userFromServer = await res.json()
        if(userFromServer.username){setActiveUser(userFromServer)}
      }


      // auto login      
      getUser()

    }
  },[])

  useEffect(()=>{
    if(hambOpen){
      hamb.current.className = "hamburger hamburger--elastic is-active"
      mainMenu.current.className = "main-menu show"
    } else {
      hamb.current.className = "hamburger hamburger--elastic"
      mainMenu.current.className = "main-menu"
    }
  },[hambOpen])

  

  return (
    <>
    <div className='header'>
      <div style={{textAlign: "center"}}>
        <StarIcon className="titleIcon" viewBox='0 0 22 22' />      
        <h1 className='font-effect-emboss'>BEST MOVIES<br/><small>(Oscar winners and nomenees)</small></h1>
      </div>      
      
      {/* MENU */}
      <button ref={hamb} className="hamburger hamburger--elastic" type="button"
      onClick={(e)=>{setHambOpen(prev => !prev)}}
      style={{position: 'relative', top: "25px"}}>
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </button>

      {/* MENU ITEMS */}
      <div ref={mainMenu} className='main-menu'>
        <ul>
          <li><Link to='/'><HomeIcon className='menu-icon' viewBox='0 0 22 22' />Home</Link></li>
          <li><Link to='/statistics'><ArrowTrendingUpIcon className='menu-icon' viewBox='0 0 22 22' />Statistics</Link></li>
          <li><a href='https://www.paypal.com/donate/?hosted_button_id=YV3874VHEJ5R8' target='_blank'><CreditCardIcon className='menu-icon' viewBox='0 0 22 22' />Donate</a></li>
          <li><Link to='/about'><QuestionMarkCircleIcon className='menu-icon' viewBox='0 0 22 22' />About</Link></li>          
        </ul>
      </div>
      
      {!isLoading && 
      <div className="div-right-bottom">
        {!ActiveUser._id ? (<button className='btn-link btn-right-bottom' 
        onClick={(e)=>{setShowLogin(true)}}>Login</button>) : 
        (<><label className='username'>{ActiveUser.username}</label>|
        <button className='btn-link' onClick={(e)=>{
          setActiveUser({username: '', password: '', watchedmovies:[]})
          sessionStorage.removeItem("userID")
          localStorage.removeItem("userID")
          toast.success('User logged out!')
          }}>Logout</button></>)}
      </div>
      }
    </div>
    
    <Suspense fallback={<Loading />}>
      { showLogin && <Login setShowLogin={setShowLogin} showLogin={showLogin}/>}
    </Suspense>
    </>
  )
}

export default Header
