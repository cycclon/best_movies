import { useActiveUser } from "./context/ActiveUserContext"

const MoviesCounter = ({ movies, watchedMovies }) => {
  const activeUser = useActiveUser()  

  const watchedMoviesCounter = () => {
    let counter = 0
    movies.forEach(movie => {
      if(watchedMovies.watched_movies.find(m => m === movie.name) !== undefined){
        counter +=1
      }
    });

    return counter
  }

  return (
    <div className="counter-wrapper">
      <div className="total-watched-wrapper">
        <label className="form-label">Total movies:</label>
        <label className="label-counters">{ movies.length}</label><br />
        {activeUser._id &&
        <><label className="form-label">Watched:</label>
        <label className="label-counters">{watchedMoviesCounter()}</label></>}
      </div>
      { activeUser._id &&

      <div className="remaining-wrapper">
        <label className="form-label">Remaining:</label>
        <label className="remaining">{movies.length - watchedMoviesCounter()}</label>
      </div>
      }
      <br />
      <progress className="large" max="100" value={String(watchedMoviesCounter() / movies.length*100)} ></progress>
    </div>
  )
}

export default MoviesCounter
