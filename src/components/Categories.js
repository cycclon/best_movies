import Category from "./Category"

const Categories = ({ categories, movies, forceUpdate, setForceUpdate}) => {
  return (
    <div className='categories'>
      {categories.map((category)=>{
        return (<Category key={category._id} category={category} 
          movies={movies} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />)
      })}
    </div>
  )
}

export default Categories
