import { useEffect, useState } from "react"
import getDrones from "../utils/getDrones";
import getPilots from "../utils/getPilots";

function Drones() {
  const url = 'http://localhost:3000/getDrones'
  const [droneData, setDroneData] = useState([])

  useEffect(() => {
    setDroneData([]);
    getDrones(url).then(drones => {
    setDroneData(drones.drone)
    })
  }, [])

  

  console.log(droneData)

  return (
    <>
      {droneData.map((drones) => 
        <tbody 
          key={drones.id}>
            <tr>
              <td>
                {drones.model}
              </td>
            </tr>
        </tbody>)}
    </>
  )
}

export default Drones