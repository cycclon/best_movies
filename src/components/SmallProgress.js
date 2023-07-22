import { useActiveUser } from "./context/ActiveUserContext"

const SmallProgress = ({ categoryName, movies }) => {
  const activeUser = useActiveUser()

  const totalMovies = ()=>{
    return movies.filter((m)=>m.nominations.filter((n)=>n.category === categoryName).length>0).length
  }

  const watchedMovies = ()=>{
    const totalM = movies.filter((m)=>m.nominations.filter((n)=>n.category === categoryName).length>0)
    
    return totalM.filter((m2)=>{
      return activeUser.watchedmovies.find((wm)=>wm===m2._id)
    }).length
    // return 0
  }

  const progressAmount = () => {
    let progress = 0
    if(watchedMovies() && totalMovies()) {
      progress = watchedMovies() / totalMovies() * 100
    }
    return progress
  }

  return (
    <div style={{ marginLeft: "10px"}}>
      {activeUser.username !== '' && <><progress className={progressAmount()===100 ? 'small-completed' : 'small'} max="100" value={progressAmount()}>
        </progress><label className="watchedSmall" >({watchedMovies()}/{totalMovies()})</label></>}      
    </div>
  )
}

export default SmallProgress