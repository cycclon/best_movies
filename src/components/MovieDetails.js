import { useEffect, useRef } from 'react'
import Nomination from './Nomination'
import { useActiveUser } from './context/ActiveUserContext'
import MoviePoster from './MoviePoster'

const MovieDetails = ({ movie, showDetails, setShowDetails, toggleWatched, loading }) => {
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

  return (
    <dialog ref={modal} className='modal' >
      <button className='btn btn-right' onClick={()=>{
        showDetails = !showDetails
        setShowDetails(showDetails)
        //console.log(showDetails)    
        
        }}>Close</button>
        <label className="movie-title-big">{movie.name} <small>({movie.year})</small></label>
        <div className="div-centered">
          <input type="checkbox" className='checkbox' disabled={loading} ref={markWatched}
          value={activeUser.watchedmovies.includes(movie._id)} 
          checked={activeUser.watchedmovies.includes(movie._id)} onChange={(e)=>toggleWatched()} />
          <label ref={markedLabel} className='form-label' disabled={loading}>Mark as watched</label>
          {activeUser.username === '' && <label className='light-italic'>(Changes will not be saved unless you log-in!)</label>}          
          {!activeUser.watchedmovies.includes(movie._id) ? <a target='_blank' rel="noreferrer"
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
