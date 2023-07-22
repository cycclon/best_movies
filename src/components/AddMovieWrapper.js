import { useActiveUser } from "./context/ActiveUserContext"
import { Suspense, lazy, useState } from 'react'
import Loading from './Loading';

const AddMovie = lazy(()=> import('./AddMovie'))

const AddMovieWrapper = ({ categories, addMovie }) => {
  const activeUser = useActiveUser()
  const [ showNMForm, setShowNMForm ] = useState()

  return (<><Suspense fallback={<Loading />} >
    {activeUser._id && activeUser.username === 'PedroCin' ? <div>
      <input type="button" value={showNMForm ? 'Close form' : 'New movie'} 
          className='btn' style={{marginTop: '15px', marginLeft: 'auto', marginRight: "auto", display: "block"}}
          onClick={(e)=>setShowNMForm(!showNMForm)} />
          {showNMForm && <AddMovie categories={categories} onAdd={addMovie} />}    
    </div>
    :""}
    </Suspense>
  </>)
}

export default AddMovieWrapper
