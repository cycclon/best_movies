// REACT IMPORTS
import  React, { useState, useEffect, useContext } from 'react'

// COMPONENT IMPORTS
import Categories from '../components/Categories';
import MoviesCounter from '../components/MoviesCounter';
import AddMovieWrapper from '../components/AddMovieWrapper';
import Loading from '../components/Loading';
import Information, { Options } from '../components/Information';

// LIBRARY IMPORTS
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

// CONTEXT IMPORTS
import { ServerContext } from '../App';
import { useLoading, useLoadingUpdate } from '../components/context/LoadingContext';
import { useActiveUser } from '../components/context/ActiveUserContext';
import { useUsersUpdate } from '../components/context/UsersContext';

const Home = () => {
  
  const [ categories, setCategories ] = useState([])
  const [ movies, setMovies ] = useState([])  
  const [ forceUpdate, setForceUpdate ] = useState(false)
  const [ yearFilter, setYearFilter ] = useState(0)
  const DATASERVER_ADDR = useContext(ServerContext)
  const isLoading = useLoading()
  const setIsLoading = useLoadingUpdate()
  const activeUser = useActiveUser()
  const [InfoMessages, setInfoMessages] = useState([])
  const setUsers = useUsersUpdate()
  
  
  // GET ALL USERS
  const getUsers = async () => {
    const res = await fetch(DATASERVER_ADDR+'/users',
      {mode: 'cors'})

    const usersFromServer = await res.json()
    setUsers(usersFromServer)
    //console.log(`${usersFromServer.length} users fetched from server`)
  }

  useEffect(()=>{getUsers()},[])

  // SET INFORMATION MESSAGES DEPENDING ON USER LOGIN
  useEffect(()=>{
    setInfoMessages((im)=>[{key: 1, message:'Click on each movie title to display it\'s details'}, {key: 3, message:'The number next to each movie title, represents the qty of users that recommended the movie'}])
    //console.log(InfoMessages.length)
    if(activeUser.username !==''){
      setInfoMessages((im)=>[...im,{key: 2, message:'Click on the badge check next to each movie to recommend it. (You must marked it as watched first)'}])
    }

  },[activeUser])


  useEffect(()=>{
    setIsLoading(true)

      const getCategories = async () => {
        const categoriesFromServer = await fetchData('/categories')
        categoriesFromServer.sort((a,b)=>{
          if(a.name < b.name){return -1}
          if(b.name < a.name){return 1}
          return 0
        })
        setCategories(categoriesFromServer)      
      }

      const getMovies = async () => {
        const moviesFromServer = await fetchData('/movies')
        moviesFromServer.sort((a, b)=>{
          if(a.year>b.year){return -1}
          if(b.year>a.year){return 1}
          return 0
        })

        let filteredMovies
        if(Number(yearFilter) !== 0) {
          filteredMovies = [...moviesFromServer.filter((m)=>m.year===Number(yearFilter))]
        } else { 
          filteredMovies = [...moviesFromServer]
        }

        setMovies([...filteredMovies])      
      }

      
        const loadData = async ()=>{
          await getUsers()
          await getCategories()
          await getMovies()      
          setIsLoading(false)
        }
          
    
      loadData();

    
  }, [yearFilter])

  const fetchData = async (api) => {
    const res = await fetch(DATASERVER_ADDR+api,
    {mode: 'cors'})
    const data = await res.json()
    return data
  }

  // CREATE A NEW MOVIE
  const addMovie = async (movie) =>{
    const res = await fetch(DATASERVER_ADDR+ '/movies', 
    {method: 'POST', headers: {'content-type': 'application/json'}, 
    body: JSON.stringify(movie)})

    const data = await res.json()

    setMovies([...movies, data])
    toast.success("Movie added!")
  }

  // MODIFIY AN EXISTING MOVIE
  // const updateMovie = async (updatedMovie)=>{
  //   const res = await fetch(DATASERVER_ADDR+ `/movies/${updatedMovie._id}`, 
  //   {method: 'PATCH', headers: {'content-type': 'application/json'}, 
  //   body: JSON.stringify(updatedMovie)})
  //   //console.log(res.json())
  // }  

  return (
    <>
      
      {isLoading ? <Loading /> : <>

        <AddMovieWrapper categories={ categories } addMovie={addMovie} />      
        <MoviesCounter movies={movies} />
        
        <div className="filters" style={{marginBottom: "30px"}}>
          <label className='form-label' style={{display: "inline-block", position: "relative", top: "3px"}}>Filter by year:</label>
          <ul className='filters'>
            <li style={yearFilter===0 ? {background: 'var(--main-bg-color)'} : {}} onClick={e=>setYearFilter(0)}>All years</li>
            <li style={yearFilter===2022 ? {background: 'var(--main-bg-color)'} : {}} onClick={e=>setYearFilter(2022)}>2022</li>
            <li style={yearFilter===2021 ? {background: 'var(--main-bg-color)'} : {}} onClick={e=>setYearFilter(2021)}>2021</li>
            <li style={yearFilter===2020 ? {background: 'var(--main-bg-color)'} : {}} onClick={e=>setYearFilter(2020)}>2020</li>
          </ul>
        </div>
        
        <Information options={Options().Popup} messages={InfoMessages} /> 
        <Categories categories={categories} movies={movies}
        forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />
      </>}
    </>      
  )
}

export default Home