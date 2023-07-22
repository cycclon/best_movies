import { useRef, useState } from "react"
import ReasonsCheckedCategory from "./ReasonsCheckedCategory"

const CategoryAddMovie = ({ category, movie, setMovie, reset }) => {
  const [marked, setMarked] = useState(false)
  const [reasons, setReasons] = useState([])
  const [winner, setWinner] = useState(false)
  const markNomination = useRef()
  const markWinner = useRef()
 
  reset.push({func: setMarked, type: 'boolean'})
  reset.push({func: setReasons, type: 'array'})
  reset.push({func: setWinner, type: 'boolean'})

  const handleCheckbox = (e) => {
    setMarked(e.currentTarget.checked)

    let updatedNominations
    if(e.currentTarget.checked){   
      updatedNominations = [...movie.nominations]   
      updatedNominations.push({ category: category.name, reason: [], winner: winner})      
    } else {
      updatedNominations = movie.nominations.filter((n)=>n.category !== category.name)
    }

    setMovie({...movie, nominations: updatedNominations})
    //console.log(updatedNominations)
  }

  const addReason = (newReason) => {
    //console.log(newReason)
    const newReasons = [...reasons]
    newReasons.push(newReason)
    //console.log(newReasons)
    setReasons([...newReasons])
    //console.log(reasons)
    const newMovie = {...movie}
    newMovie.nominations.find((n)=>n.category===category.name).reason = [...newReasons]
    setMovie({...newMovie})
  }

  const removeReason = (removedReason)=> {
    const updatedReasons = reasons.filter((r)=>r !== removedReason)
    setReasons(updatedReasons)
    const newMovie = {...movie}
    newMovie.nominations.find((n)=>n.category===category.name).reason = [...updatedReasons]
    setMovie({...newMovie})
  }

  const winnerCheckedChanged = (e) =>{
    setWinner(e.currentTarget.checked)
    const newMovie = {...movie}
    newMovie.nominations.find((n)=>n.category===category.name).winner = e.currentTarget.checked
    setMovie({...newMovie})
  }

  return (
    <div className={marked ? 'form-field categories-am categories-am-checked': 'form-field categories-am'}>
      
      <label  className="categoryTitle-am">
      <input ref={markNomination} type="checkbox" value={marked} checked={marked} 
      onChange={(e)=>handleCheckbox(e)} className="checkbox" />
      { category.name }</label>
      {marked ? <><label className="form-label">
        <input type="checkbox" ref={markWinner} className="checkbox" checked={winner} value={winner}
        onChange={(e)=>winnerCheckedChanged(e)}  />
        Winner of this category {movie.year ? `on ${movie.year}`: ''}</label></> : ''}
      {marked ? (<><ReasonsCheckedCategory reasons={reasons} categoryID={category._id} 
      addReason={addReason} removeReason={removeReason} /></>) : ''}
    </div>
  )
}

export default CategoryAddMovie