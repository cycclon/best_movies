import Category from "./Category"

const Categories = ({ categories, movies, allRecommendations, updateRecommendations, watchedMovies, updateWatchedMovies}) => {
  return (
    <div className='categories'>
      {categories.map((category)=>{
        return (<Category key={category._id} category={category}
          movies={movies} allRecommendations={allRecommendations} updateRecommendations={updateRecommendations} 
          watchedMovies={watchedMovies} updateWatchedMovies={updateWatchedMovies} />)
      })}
    </div>
  )
}

export default Categories
