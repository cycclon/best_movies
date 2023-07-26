import Winner from './Winner'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useActiveUser, useActiveUserUpdate } from './context/ActiveUserContext'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { useUsers, useUsersUpdate } from './context/UsersContext'
import Loading from './Loading'

const MovieDetails = lazy(()=> import('./MovieDetails'))

const MovieSmall = ({ movie, showNominationDetails, categoryName, forceUpdate, setForceUpdate }) => {
  const [showDetails, setShowDetails] = useState()  
  const activeUser = useActiveUser()
  const setActiveUser = useActiveUserUpdate()
  const [loading, setLoading] = useState(false)
  const users = useUsers()
  const setUsers = useUsersUpdate()
  const [rc, setRC] = useState(0)
  const [ showRecommenders, setShowRecommenders] = useState(false)
  const modal = useRef()

  // useEffect(()=>{
  //   recommendationsCount()    
  // },[])

  // useEffect(()=>{
  //   recommendationsCount()
  // },[users])

  // useEffect(()=>{
  //   if(showRecommenders){
  //     //console.log('show modal here')
  //     modal.current.className = 'recommenders'
  //     modal.current.show()
  //   } else {
  //     modal.current.className = 'recommenders hide'
  //     delay(300).then(()=> modal.current.close())      
  //   }
  // },[showRecommenders])

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  
  // WATCH/UNWATCH A MOVIE
  const toggleWatched = async () =>{
    
    const updatedUser = activeUser

    // IF WATCHED, UN-WATCH IT
    if(activeUser.watchedmovies.includes(movie._id)){
      updatedUser.watchedmovies = [...activeUser.watchedmovies.filter((m)=>m!==movie._id)]
    } else{ // ELSE MARK AS WATCHED
      updatedUser.watchedmovies.push(movie._id)
    } 

    if(activeUser.username !== ''){
      setLoading(true)
      await fetch(process.env.REACT_APP_USERS_MS + `/users/${activeUser._id}`, 
      {method: 'PATCH', headers: {'content-type': 'application/json'}, body: JSON.stringify(updatedUser)})
      setLoading(false)
    }

    setActiveUser(updatedUser)
    updatedUser.watchedmovies.includes(movie._id) ? toast.success('Movie marked as watched') 
    : toast.success("Movie marked as NOT watched")
    
    setForceUpdate((fu)=>!fu)
  }

  // RECOMMEND/UN-RECOMMEND A MOVIE
  const toggleRecommended = async () => {
    let updatedUser = activeUser

    // IF RECOMMENDED, UN-RECOMMEND IT
    if(activeUser.recommendations.includes(movie._id)){
      updatedUser.recommendations = [...activeUser.recommendations.filter((m)=>m!==movie._id)]
    } else {
      updatedUser.recommendations.push(movie._id)
    }

    if(activeUser.username !== '') {
      setLoading(true)
      await fetch(process.env.REACT_APP_USERS_MS + `/users/${activeUser._id}`,
      {method: 'PATCH', headers: {'content-type': 'application/json'}, body: JSON.stringify(updatedUser)})
      setActiveUser(updatedUser)
      setUsers([...users.filter((u)=>u._id !== updatedUser._id), updatedUser])
      setLoading(false)
    }    
    
    updatedUser.recommendations.includes(movie._id) ? toast.success(`Recommended: ${movie.name}`)
    : toast.success(`${movie.name} un-recommended`)    
  }

  const recommendationsCount = async ()=>{
    let count = 0
    
    users.map(user => {
      
      if(user.recommendations !== undefined) {
        if(user.recommendations.includes(movie._id)){count++}
      }

      return ''
    });
    
    setRC(count)
    //if(movie.name === 'King Richard'){console.log(rc)}
  }

  const displayDetails = () => {
    let details = '('
    movie.nominations.find((n)=>n.category === categoryName).reason.forEach(element => {
      details = details + ' ' + element + ','
    });
    details = details.slice(0, details.length -1)
    details = details + ' )'
    return details
  }

  return (
    <div className="movieSmall">

      <Suspense fallback={<Loading />}>
        {showDetails && <MovieDetails movie={movie} 
        showDetails={showDetails} setShowDetails={setShowDetails} toggleWatched={toggleWatched}
        loading={loading} />}
      </Suspense>
      

      <span className="movieYear">{movie.year}</span><span> - </span>

      {/* Add this after adding watched movies api: className={activeUser.watchedmovies.find((m)=>m===movie._id) ? 'movieName watched' : 'movieName'} */}
      <span 
      onClick={(e)=>setShowDetails(!showDetails)} title='Click to show movie details'>{movie.name}</span>

      {/* {activeUser.username !== '' && activeUser.watchedmovies.includes(movie._id) && <CheckBadgeIcon className={activeUser.recommendations.find((m)=>m===movie._id) ? 
      'recommended-icon' : 'not-recommended-icon'} viewBox='0 0 24 24' 
      title={activeUser.recommendations.find((m)=>m===movie._id)?'Click to un-recommend' : 'Click to recommend'}
      onClick={(e)=>{toggleRecommended()}} /> } */}

      {rc > 0 && <span className="recommendations-small" title={rc + ' users recommend this movie'}
                  onClick={(e)=>setShowRecommenders(true)}
      >({rc})</span>}
      <dialog className='recommenders' ref={modal}>
        <div className='window-header'>
          <h4 style={{float: "left", maxWidth:"250px"}}>Users who recommended {movie.name}:</h4>
          <button className='btn-close' onClick={(e)=>{setShowRecommenders(false)}}>x</button>
        </div>
        {/* {users.map(user=>{
          if(user.recommendations.includes(movie._id)){
            //console.log(user.username)
            return <p style={{marginTop: "2px"}} key={user._id}>{user.username}</p>
          }
          return ''
        })} */}
      </dialog>

      {movie.nominations.find((nom)=>nom.category===categoryName).winner && 
      <Winner /> }

      <br />
      {showNominationDetails ? <label className='nomination-details'>{displayDetails()}</label> : ''}
    </div>
  )
}

export default MovieSmall
