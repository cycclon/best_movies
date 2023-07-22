import { useState } from 'react'
import CategoriesAddMovie from './CategoriesAddMovie'
import { VideoCameraIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-toastify'

const AddMovie = ({ onAdd, categories }) => {
  const [movie, setMovie] = useState({name: '', year: '', nominations: [], watched: false})
  const [ saving, setSaving ] = useState(false) 

  const onSubmit = async (e)=>{
    e.preventDefault()
    setSaving(true)

    if(!movie.name){
      //alert('Please enter a name')
      toast.error('Please enter a name')
      setSaving(false)
      return
    }

    await onAdd(movie)
    setSaving(false)

    setMovie({name: '', year: '', nominations: [], watched: false})
    reset.map((r)=>{
      switch(r.type){
        case 'boolean':
          r.func(false)
          break
        case 'array':
          r.func([])
          break
        default:
          break
      }
      return 0
    })
    
  }

  const reset = []

   return (
    <form  onSubmit={onSubmit}>      
      <div className="addMovie-form">
        <h3>ADD NEW MOVIE</h3>
        <VideoCameraIcon className='new-movie-icon' viewBox='0 0 22 22' />
        <div className="form-field">
          <label className="form-label">Name:</label>
          <input disabled={saving} type="text" placeholder='Enter a movie name' 
          value={movie.name} onChange={(e)=>setMovie({...movie, name: e.target.value})} style={{width: "280px"}} />
        </div>
        <div className="form-field">
          <label className="form-label">Year:</label>
          <input disabled={saving} type="text" placeholder='2023' 
          value={movie.year} onChange={(e)=>setMovie({...movie, year: e.target.value})} style={{width: "50px"}} />
        </div>
        <CategoriesAddMovie disabled={saving} categories={categories} movie={movie} setMovie={setMovie} reset={reset}/>
        
        <input disabled={saving} type="submit" value={saving ? 'Saving movie...' : 'Save movie'} 
        className='btn btn-centered' style={{textAlign: "center"}} />
      </div>
    </form>
    
  )
}

export default AddMovie
