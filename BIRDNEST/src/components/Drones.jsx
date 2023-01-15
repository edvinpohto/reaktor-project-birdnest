import { useEffect, useState } from "react"
import getDrones from "../utils/getDrones";
import getPilots from "../utils/getPilots";
import useInterval from "../Hooks/useInterval.js"
import formatDateAndTime from "../utils/formatDateAndTime";

const testData = {
  "captureTime": "2023-01-14T11:44:59.912Z",
  "serialNumber":"SN-CtkCCCa494",
  "positionX": 218396.27840733784,
  "positionY": 266286.3543394989,
  "distance": 35553.34803050502,
  "pilotId": "P-dEyWAcrXkr",
  "firstName": "Prince",
  "lastName": "Hickle",
  "phoneNumber": "+210537721762",
  "createdDt": "2022-04-24T13:40:24.352Z",
  "email": "prince.hickle@example.com"
}

function Drones() {
  const url = 'http://localhost:3000/getDrones'
  const [droneData, setDroneData] = useState([])
  // const [droneData, setDroneData] = useState([testData])

  // Activate for server connection when not testing with testdata
  useInterval(() => {
    getDrones(url).then(drones => {
      setDroneData(drones.drones)
      })
  }, 2000);

  console.log(droneData)

  return (
    <>
      <div className="w-fullGrid mt-5 ml-5 overflow-x-auto relative shadow-md sm:rounded-md">
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