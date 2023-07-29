import Winner from './Winner'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useActiveUser } from './context/ActiveUserContext'
import { toast } from 'react-toastify'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import Loading from './Loading'

const MovieDetails = lazy(()=> import('./MovieDetails'))

const MovieSmall = ({ movie, showNominationDetails, categoryName, allRecommendations, updateRecommendations, watchedMovies, updateWatchedMovies }) => {
  const [showDetails, setShowDetails] = useState()  
  const activeUser = useActiveUser()
  const [loading, setLoading] = useState(false)
  const modal = useRef()  

  // RETURNS TRUE IF THE USER RECOMMENDED THIS MOVIE
  const isRecommendedByActiveUser = ()=> {    
    let recommended = false
    
    if(getRecommendations().recommended_by.find(user => user === activeUser.username) !== undefined) {
      recommended = true
    }

    return recommended
  }

  // RECOMMEND/UN-RECOMMEND A MOVIE
  const toggleRecommended = async () => {
    
    // DETERMINE IF RECOMMEND OR UN-RECOMMEND
    let api = 'recommend'
    if(isRecommendedByActiveUser()){
      api = 'un-recommend'
    }

    await fetch(process.env.REACT_APP_RECOMMENDATIONS_MS + `/recommendations/${api}`,
         {method: 'PATCH',          
          mode: 'cors', 
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({ movie: movie.name, user: activeUser.username})})

    // SHOW SUCCESS MESSAGE
    let message
    if(isRecommendedByActiveUser()) {
      message = ' un-recommended'
    } else {
      message = ' recommended'
    }
    toast.success(movie.name + message)

    updateRecommendations()
  }

  const recommendationsCount = ()=>{
    return getRecommendations().recommended_by.length
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

  const getRecommendations = ()=>{
    if(allRecommendations !== undefined && allRecommendations.find(r => r.movie === movie.name) != undefined){
      return allRecommendations.find(r => r.movie === movie.name)
    } else {
      return {movie: movie.name, recommended_by: []}
    }    
  }

  return (
    <div className="movieSmall">

      <Suspense fallback={<Loading />}>
        {showDetails && <MovieDetails movie={movie} 
        showDetails={showDetails} setShowDetails={setShowDetails}
        watchedMovies={watchedMovies} updateWatchedMovies={updateWatchedMovies}
        loading={loading} />}
      </Suspense>      

      <span className="movieYear">{movie.year}</span><span> - </span>

      
      <span 
      className={watchedMovies.watched_movies.find((m)=>m===movie.name) ? 'movieName watched' : 'movieName'}
      onClick={(e)=>setShowDetails(!showDetails)} title='Click to show movie details'>{movie.name}</span>

      {activeUser.username !== '' && <CheckBadgeIcon className={getRecommendations().recommended_by.find( user => user === activeUser.username) ? 
      'recommended-icon' : 'not-recommended-icon'} viewBox='0 0 24 24' 
      title={getRecommendations().recommended_by.find( user => user === activeUser.username) ?'Click to un-recommend' : 'Click to recommend'}
      onClick={(e)=>{toggleRecommended()}} /> }

      {recommendationsCount() > 0 && <span className="recommendations-small" title={recommendationsCount() + ' users recommend this movie'}>({recommendationsCount()})</span>}
      <dialog className='recommenders' ref={modal}>
        <div className='window-header'>
          <h4 style={{float: "left", maxWidth:"250px"}}>Users who recommended {movie.name}:</h4>
          <button className='btn-close'>x</button>
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
