import { useActiveUser } from "./context/ActiveUserContext"
import { useState } from "react"

const MoviesCounter = ({ movies }) => {
  const activeUser = useActiveUser()
  const [ aUser, setAUser ] = useState({username: '', password: '', watchedmovies:[]})

  return (
    <div className="counter-wrapper">
      <div className="total-watched-wrapper">
        <label className="form-label">Total movies:</label>
        <label className="label-counters">{ movies.length}</label><br />
        {activeUser._id &&
        <><label className="form-label">Watched:</label>
        <label className="label-counters">{ 
          activeUser.watchedmovies.filter((m)=>{
            return movies.find((m2)=>{
              // console.log(m2._id)
              return m2._id === m
            })
          }).length 
        }</label></>}
      </div>
      { aUser._id &&

      <div className="remaining-wrapper">
        <label className="form-label">Remaining:</label>
        <label className="remaining">{movies.length - activeUser.watchedmovies.filter((m)=>{
            return movies.find((m2)=>{
              // console.log(m2._id)
              return m2._id === m
            })
          }).length }</label>
      </div>
      }
      <br />
      <progress className="large" max="100" value={String(activeUser.watchedmovies.filter((m)=>{
            return movies.find((m2)=>{
              // console.log(m2._id)
              return m2._id === m
            })
          }).length /movies.length*100)} ></progress>
    </div>
  )
}

export default MoviesCounter
