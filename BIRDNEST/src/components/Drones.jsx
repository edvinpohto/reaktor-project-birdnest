import { useState } from "react"
import getDrones from "../utils/getDrones";
import useInterval from "../Hooks/useInterval.js"

// Main component. Fetches data and displays it as a table. Styled with TailwindCSS.
function Drones() {
  const url = 'http://localhost:3000/getDrones'
  const [droneData, setDroneData] = useState([])

  // Initial load of data.
  getDrones(url).then(drones => {
    setDroneData(drones.drones)
  })

  // Fetches data at an interval of 2 seconds and updates the state with it.
  useInterval(() => {
    getDrones(url).then(drones => {
      setDroneData(drones.drones)
      })
  }, 2000);

  return (
    <>
      <div className="flex justify-center w-100  mt-5 ml-5 overflow-x-auto relative shadow-md sm:rounded-md">
        <div className="">
          <table className="w-full table-fixed">
            <thead className="bg-navbarBG text-grayText">
              <tr className="h-headerHeight text-small">
                <th className="w-20">Pilot Name</th>
                {/* <th className="w-20">Date and Time</th> */}
                <th className="w-10">Distance</th> {/* Could add a tooltip here */}
                <th className="w-32">Email Address</th>
                <th className="w-20">Phone Number</th>
              </tr>
            </thead>
            {droneData.map((drones) => 
            <tbody 
              key={drones.pilotId}
              className="bg-tableBG text-whiteText">
                <tr className="mt-1 h-4 border-b border-borderGray">
                  <td className="text-grayText font-semibold text-center px-4 py-4">{drones.firstName.concat(" ", drones.lastName)}</td>
                  {/* <td className="font-medium text-center px-4 py-4">{formatDateAndTime(drones.captureTime)}</td> */}
                  <td className="text-grayText font-medium">{(drones.distance / 1000).toFixed(2) + "m"}</td>
                  <td className="text-grayText font-medium">{drones.email}</td>
                  <td className="text-grayText font-medium">{drones.phoneNumber}</td>
                </tr>
            </tbody>)}
          </table>
        </div>
      </div>
    </>
  )
}

export default Drones