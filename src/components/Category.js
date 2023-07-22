import { FilmIcon } from '@heroicons/react/24/solid'
import MovieSmall from './MovieSmall'
import SmallProgress from './SmallProgress'

const Category = ({ category, movies, forceUpdate, setForceUpdate}) => {
  const catMovies = movies.filter((movie)=>movie.nominations.find((nomination)=>nomination.category === category.name))
  catMovies.sort((a, b)=>{
    if(a.year===b.year){
      if(a.nominations.find((nomination)=>nomination.category === category.name).winner) return -1
      if(b.nominations.find((nomination)=>nomination.category === category.name).winner) return 1
      return 0
    } 
    if(b.year>a.year) { return 1 }
    if(a.year>b.year) { return -1 }    

    return 0
  })
  // const catMovies = movies
  return (
    <div className='category'>
      <FilmIcon className='categoryIcon' viewBox='0 0 22 22'/>
      <span className='categoryTitle'>{category.name}</span>
      <SmallProgress categoryName={category.name} movies={movies} />
      <div className='movies_x_category'>
        {catMovies.length > 0 ? (catMovies.map((movie)=>{
          return <MovieSmall key={movie._id} movie={movie} 
          categoryName={category.name} showNominationDetails={category.showDetails} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />
          })) : ('No movies to show here')}
      </div>
    </div>
  )
}

export default Category
