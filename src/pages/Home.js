// REACT IMPORTS
import  React, { useState, useEffect} from 'react'

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
import { useLoading, useLoadingUpdate } from '../components/context/LoadingContext';
import { useActiveUser } from '../components/context/ActiveUserContext';

const Home = () => {
  
  const [ categories, setCategories ] = useState([])
  const [ movies, setMovies ] = useState([])  
  const [ yearFilter, setYearFilter ] = useState(0)
  const isLoading = useLoading()
  const setIsLoading = useLoadingUpdate()
  const activeUser = useActiveUser()
  const [InfoMessages, setInfoMessages] = useState([])
  const [ allRecommendations, setAllRecommendations] = useState([])
  const [ watchedMovies, setWatchedMovies ] = useState({username: '', watched_movies: []})

  useEffect(()=>{    
    async function loadData(){
      await updateRecommendations()
      await updateWatchedMovies()
    }
    loadData()    
  },[])

  //useEffect(()=>{console.log(watchedMovies)},[watchedMovies])

  const updateWatchedMovies = async () => {
    if(activeUser.username !== ''){
      const userWatchedMovies = await fetchData(process.env.REACT_APP_WATCHED_MOVIES_MS, `/watched_movies/${activeUser.username}`)
      setWatchedMovies(userWatchedMovies)
    } else {
      setWatchedMovies({username: '', watched_movies: []})
    }    
  }

  const updateRecommendations = async ()=> {
    const recommendations = await fetchData(process.env.REACT_APP_RECOMMENDATIONS_MS, '/recommendations')
    setAllRecommendations([...recommendations])
  }

  // SET INFORMATION MESSAGES DEPENDING ON USER LOGIN
  useEffect(()=>{
    setInfoMessages((im)=>[{key: 1, message:'Click on each movie title to display it\'s details'}, {key: 3, message:'The number next to each movie title, represents the qty of users that recommended the movie'}])
    
    if(activeUser.username !==''){
      setInfoMessages((im)=>[...im,{key: 2, message:'Click on the badge check next to each movie to recommend it.'}])
    }

    const loadWatchedMovies = async () => {
      await updateWatchedMovies()
    }
    loadWatchedMovies()

  },[activeUser])

  useEffect(()=>{
    setIsLoading(true)

      // GET CATEGORIES
      const getCategories = async () => {
        const categoriesFromServer = await fetchData(process.env.REACT_APP_MOVIES_MS, '/categories')
        categoriesFromServer.sort((a,b)=>{
          if(a.name < b.name){return -1}
          if(b.name < a.name){return 1}
          return 0
        })
        setCategories(categoriesFromServer)      
      }

      // GET MOVIES
      const getMovies = async () => {
        const moviesFromServer = await fetchData(process.env.REACT_APP_MOVIES_MS, '/movies')
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
          await getCategories()
          await getMovies()
                
          setIsLoading(false)
        }         
    
      loadData();
    
  }, [yearFilter])  

  const fetchData = async (server, api) => {
    const res = await fetch(server+api,
    {mode: 'cors'})
    const data = await res.json()
    return data
  }  

  // CREATE A NEW MOVIE
  const addMovie = async (movie) =>{
    const res = await fetch(process.env.REACT_APP_MOVIES_MS +     '/movies', 
    {method: 'POST', headers: {'content-type': 'application/json'}, 
    body: JSON.stringify(movie)})

    const data = await res.json()

    setMovies([...movies, data])
    toast.success("Movie added!")
  }

  return (
    <>
      
      {isLoading ? <Loading /> : <>

        <AddMovieWrapper categories={ categories } addMovie={addMovie} />      
        <MoviesCounter movies={movies} watchedMovies={watchedMovies} />
        
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
        allRecommendations={allRecommendations} updateRecommendations={updateRecommendations}
        watchedMovies={watchedMovies} updateWatchedMovies={updateWatchedMovies} />
      </>}
    </>      
  )
}

export default Home