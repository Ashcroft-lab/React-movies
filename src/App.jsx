import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const Card = ({ title })=> {

  const [count, setCount] = useState(0);

  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    console.log('Component mounted');

  }, [hasLiked]);

  useEffect(() => {
    console.log('Card rendered');
  }
  , []);


  return (
    <div className="card" onClick={() => setCount((prevstate) => prevstate + 1)}>
      <h2>{title} - {count}</h2>
      <button
        onClick={() => setHasLiked(!hasLiked)}>
          {hasLiked ? "Liked" : 'Like'}
      </button>

    </div>
  )
}



const App = () => {
  
  return (
    <>
      {/* <h2 className='card'>
          Hello World</h2> */}
      <div className="card-container">
        <Card title="ASH" />
        <Card title="cash" />
      </div>


    </>
  )
}

export default App
