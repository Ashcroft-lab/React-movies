import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const Card = ({ title })=> {
  const [hasLiked, setHasLiked] = useState(false);
  return (
    <div className="card">
      <h2>{title}</h2>
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
