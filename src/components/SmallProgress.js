import { useActiveUser } from "./context/ActiveUserContext"

const SmallProgress = ({ categoryName, movies, watchedMovies }) => {
  const activeUser = useActiveUser()

  const totalMovies = ()=>{
    return movies.filter((m)=>m.nominations.filter((n)=>n.category === categoryName).length>0).length
  }

  const watchedMoviesCounter = ()=>{
    let counter = 0
    movies.forEach(movie => {
      if(movie.nominations.find(n => n.category === categoryName) && watchedMovies.watched_movies.find(m => m === movie.name)) {
        counter +=1
      }
    });

    return counter
  }

  const progressAmount = () => {
    let progress = 0
    if(watchedMoviesCounter() && totalMovies()) {
      progress = watchedMoviesCounter() / totalMovies() * 100
    }
    return progress
  }

  return (
    <div style={{ marginLeft: "10px"}}>
      {activeUser.username !== '' && <><progress className={progressAmount()===100 ? 'small-completed' : 'small'} max="100" value={progressAmount()}>
        </progress><label className="watchedSmall" >({watchedMoviesCounter()}/{totalMovies()})</label></>}      
    </div>
  )
}

export default SmallProgress