import { useEffect, useRef } from 'react'
import Nomination from './Nomination'
import { useActiveUser } from './context/ActiveUserContext'
import MoviePoster from './MoviePoster'
import { toast } from 'react-toastify'

const MovieDetails = ({ movie, showDetails, setShowDetails, watchedMovies, updateWatchedMovies }) => {
  const activeUser = useActiveUser()
  const modal = useRef()
  const markedLabel = useRef()
  const markWatched = useRef()

  const setupSearch = (criteria) =>{
    return criteria.replace(/[\s,:]/g, "+")
  }

  useEffect(()=>{
    modal.current.removeAttribute('open')
    modal.current.addEventListener("close", (e)=>{
      if(showDetails){setShowDetails(false)}
    })
    markedLabel.current.addEventListener("click", (e)=>{
      markWatched.current.checked = true
      markWatched.current.click(e)
    })

    return () => {
      if(modal.current !==null){
        modal.current.removeEventListener("close", (e)=>{
          if(showDetails){setShowDetails(false)}
        })
      }

      if(markedLabel.current !== null){
        markedLabel.current.removeEventListener("click", (e)=>{
          markWatched.current.checked = true
          markWatched.current.click(e)
        })
      }
    }
  }, [])

  useEffect(()=>{
    if(showDetails){
      //console.log('show modal here')
      modal.current.showModal()
    } else {
      modal.current.close()
    }
  },[showDetails])

  // WATCH/UNWATCH A MOVIE
  const toggleWatched = async () =>{
    let message = ' marked as '
    let api

    if(isWatchedByActiveUser()) {
      // UN-WATCH
      api = 'unwatch'
      message = message + 'un-watched.'
    }else {
      // WATCHED
      api = 'watch'
      message = message + 'watched.'
    }

    await fetch(process.env.REACT_APP_WATCHED_MOVIES_MS + `/watched_movies/${api}/${activeUser.username}`, 
      { method: 'PATCH', mode: 'cors',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ movie: movie.name})
    })

    toast.success(movie.name + message)
    updateWatchedMovies()
  }

  const isWatchedByActiveUser = ()=> {
    return watchedMovies.watched_movies.find(m => m === movie.name) !== undefined
  }

  return (
    <dialog ref={modal} className='modal' style={{paddingBottom: '50px'}} >
      <button className='btn btn-right' onClick={()=>{
        showDetails = !showDetails
        setShowDetails(showDetails)                
        }}>Close</button>

      <label className="movie-title-big">{movie.name} <small>({movie.year})</small></label>
      <div className="div-centered">
        <input type="checkbox" className='checkbox' ref={markWatched}
        value={isWatchedByActiveUser()} 
        checked={isWatchedByActiveUser()} onChange={(e)=>toggleWatched()} />        
        <label ref={markedLabel} className='form-label' >Mark as watched</label>

        {activeUser.username === '' && <label className='light-italic'>(Changes will not be saved unless you log-in!)</label>}  

        {!isWatchedByActiveUser() ? <a target='_blank' rel="noreferrer"
        href={'https://www.google.com/search?q='+setupSearch(movie.name)+'+streaming'} >
          (Where to watch)</a>:''}
        <MoviePoster movieName={movie.name} />
      </div>

      <div className='all-nominations'>
        <h2>All nominations:</h2>
        {
          movie.nominations.map((n)=>{
            
            return <Nomination key={n.category} nomination={n}/>
          })
        }
      </div>
    </dialog>
  )
}

export default MovieDetails
