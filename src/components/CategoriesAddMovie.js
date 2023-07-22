import CategoryAddMovie from "./CategoryAddMovie"

const CategoriesAddMovie = ({ categories, movie, setMovie, reset }) => {
  return (
    <div>
      Select nominations:
      {categories.map((category)=><CategoryAddMovie key={category._id} category={category}
       movie={movie} setMovie={setMovie} reset={reset} />)}
    </div>
  )
}

export default CategoriesAddMovie
