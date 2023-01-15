import './styles/App.css'
import { useState } from 'react'
import Drones from './components/Drones'

function App() {
  // const [droneData, setDroneData] = useState(getDrones)

  return (
    <>
      <div className='flex justify-center w-100'>
        <div className='w-9/12'>
          <h1>PROJECT BIRDNEST</h1>
          <p>By Edvin Pohto <a href="https://github.com/edvinpohto/reaktor-project-birdnest">(GitHub)</a></p>
          <br />
          <p>A rare and endangered Monadikuikka has been spotted nesting at a local lake. Unfortunately some enthusiasts have been a little too curious about this elusive bird species, flying their drones very close to the nest for rare photos and bothering the birds in the process. To preserve the nesting peace, authorities have declared the area within 100 meters of the nest a no drone zone (NDZ), but suspect some pilots may still be violating this rule.</p>
          <br />
          <p>This application tracks the pilots that fly their drones too close to the nest, violating the NDZ. The table below displays pilots that have violated the NDZ in the past 10 minutes. The table also shows the <strong>name</strong> of the pilots, the closest confirmed <strong>distance</strong> of their drones, their <strong>email addresses</strong>, and their <strong>phone numbers.</strong></p>
          <br />
        </div>
      </div>

      <Drones />
    </>
  )
}

export default App
