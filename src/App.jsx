import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { getTrendingMovies, updateSearchCount } from './appwrite';



// Rapit API
// const API_BASE_URL = "https://tmdb-movies-and-tv-shows-api-by-apirobots.p.rapidapi.com/v1/tmdb"
// const API_KEY = import.meta.env.VITE_API_KEY;
// const API_HOST = "tmdb-movies-and-tv-shows-api-by-apirobots.p.rapidapi.com"
//
// const API_OPTIONS = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     'x-rapidapi-key': import.meta.env.VITE_API_KEY,
// 		'x-rapidapi-host': API_HOST
//   }
// }


// TMDB API
const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query="") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // const endpoint = `${API_BASE_URL}?page=1`;
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      const data = await response.json();
      console.log("Response:", data);
      // alert(response.json());
      if (data.Response === "False") {
        setErrorMessage(data.Error || "No results found");
        setMovieList([]);
        return;
        
      }

      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
      // updateSearchCount();

    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      
      setTrendingMovies(movies);
      console.log("Trending Movies:", movies);
      
    } catch (error) {
      console.log("Error fetching trending movies:", error);
    }
  }

  useEffect(() => {
    console.log('App mounted');
    fetchMovies(debouncedSearchTerm);
  } , [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  
  return (
      <main>
        <div className='pattern'/>
        <div className='wrapper'>
          <header>
            <img src="./hero.png" alt="hero" />
            <h1>Find <span className='text-gradient'>Movies</span> You Enjoy without the hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>Trending movies</h2>
              <ul>
                {trendingMovies.map((movie, idx) => (
                  // <MovieCard key={idx} movie={movie} />
                  <li key = {movie.$id}>
                    <p>{idx+1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>


            </section>
          )}

          <section className='all-movies'>
            <h2>All Movies</h2>
            {
              isLoading ? (
                <Spinner />
              ) : errorMessage ?  (
                <p className='text-red-500'>{errorMessage}</p>
              ) : (
                
                <ul>
                  {movieList.map((movie, idx) => (
                    // <p key={idx} className='text-white'>{movie.title}</p>
                    <MovieCard key={movie.id} movie={movie} />
                    

                  ))}
                </ul>
              )
            }
            {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

          </section>
        </div>


        
      </main>
  )
}

export default App
