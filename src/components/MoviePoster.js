import axios from 'axios';
import { useEffect, useState } from 'react';
import Loading from './Loading';

const MoviePoster = ({ movieName }) => {

  const searchMovie = async (title) => {
    const response = await axios.get('https://www.omdbapi.com', {
      params: {
        t: title,
        apikey: '62bf388a',        
      },
    });
    return response.data;
  };  

  const [movieOMDB, setmovieOMDB] = useState(null);
  const [moreInfo, setMoreInfo] = useState(false)

  useEffect(() => {
    const getPosterUrl = async () => {
      const movie = await searchMovie(movieName);
      setmovieOMDB(movie);
    };
    getPosterUrl();
  }, [movieName]);

  return (
    <div>
      {movieOMDB ? (
        <>
        <img src={movieOMDB.Poster} alt={`${movieName} poster`} />
        <br />
        <button className='btn' onClick={(e)=>{
          e.preventDefault()
          setMoreInfo((mi)=>{return !mi})
        }}>{moreInfo ? '-' : '+'} info</button>
        <div style={{textAlign: "left", paddingLeft: "10px"}} hidden={!moreInfo}> 
          
          {Object.entries(movieOMDB).map(([k, v], i)=>{
            if(i>1 && i<17 && (k!=='Poster' && k !== 'Ratings')) {
              return  (<p key={k}><label className='light-italic'>{k}:</label>
              <label> {v.toString()}</label></p>)
            }
            return ''
          })}
        </div>
      </>
      ) : (
        <Loading />
      )}      
    </div>
  );
};

export default MoviePoster;