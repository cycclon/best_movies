// LIBRARY IMPORTS
import React, { lazy, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

// COMPONENT IMPORTS
import Header from './components/Header';

// CONTEXT IMPORTS
import { ActiveUserProvider } from './components/context/ActiveUserContext';
import { UsersProvider } from './components/context/UsersContext';
import { LoadingProvider } from './components/context/LoadingContext';

// PAGE IMPORTS
//import NotFound from './pages/NotFound';
//import Home from './pages/Home'
//import About from './pages/About'
//import UserRankings from './pages/Statistics';
//import Footer from './components/Footer';

// CONTEXT EXPORTS
export const ServerContext = React.createContext()

// LAZY COMPONENT IMPORTS
const NotFound = lazy(()=> import('./pages/NotFound'))
const Home = lazy(()=> import('./pages/Home'))
const About = lazy(()=> import('./pages/About'))
const UserRankings = lazy(()=> import('./pages/Statistics'))
const Footer = lazy(()=> import('./components/Footer'))

function App() {
  //const DATASERVER_ADDR = 'https://moviesapi.glitch.me/'
  const DATASERVER_ADDR = 'http://192.168.0.107:3001'
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className='wrapper '>
      <ServerContext.Provider value={DATASERVER_ADDR} >
        <LoadingProvider>
          <UsersProvider >
            <ActiveUserProvider>
                   
              <Header showLogin={showLogin} setShowLogin={setShowLogin} />
              <Routes >
                <Route path="/" element={<Home showLogin={showLogin} setShowLogin={setShowLogin} />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path='/statistics' element={<UserRankings />}></Route>
                <Route path='/donate' element="https://www.paypal.com/donate/?hosted_button_id=YV3874VHEJ5R8"></Route>
                <Route path='*' element={<NotFound />}></Route>
              </Routes>
              <Footer />
            </ActiveUserProvider>
          </UsersProvider>
        </LoadingProvider>
      </ServerContext.Provider>
    </div>
  )
}

export default App