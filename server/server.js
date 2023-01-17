import express from 'express';
import cors from 'cors';
import { droneIsViolatingNDZ, getDrones, getPilot, sendDataToDb } from './utilityFunctions.js'
import { getEntries } from './redis.js';

const app = express()
app.use(cors());
const port = 8080;

let prevDistance; // Initate a variable that stores the previous distance. See usage below.

// Fetches drone data every 2 seconds
setInterval(async function () {
  let capture = await getDrones() // getDrones is a utility function fetching drones from the provided drone positions endpoint

  for (const drone of capture.drone) { // Loop through all captured drones
    const violation = droneIsViolatingNDZ(drone.positionX, drone.positionY) // Calling the utility function that checks whether there is a violation
    if (violation[0]) { // droneIsViolatingNDZ() returns an array with the first index being a boolean value
      console.log("Found one!", "X position:", drone.positionX, "Y position:", drone.positionY)

      const pilot = await getPilot(drone.serialNumber) // getPilot is only called if violation was true
    
      // Mergin drone and pilot data to be stored as one JSON object in the DB
      const mergedData = {
        captureTime: capture['@_snapshotTimestamp'],
        serialNumber: drone.serialNumber,
        positionX: drone.positionX,
        positionY: drone.positionY,
        distance: violation[1],
        pilotId: pilot.pilotId,
        firstName: pilot.firstName,
        lastName: pilot.lastName,
        phoneNumber: pilot.phoneNumber,
        createdDt: pilot.createdDt,
        email: pilot.email
      }

      if (prevDistance != violation[1]) { // prevDistance checks that the captured distance is not exactly the same as the last distance (from same capture)
        sendDataToDb(mergedData)
        prevDistance = violation[1] // Set prevDistance to the latest distance
      }
    }
  }
}, 2000); // Called every 2 seconds

// Express endpoint for the client to call for drone retrieval from the DB
app.get('/getDrones', async (req, res, err) => {
  const drones = await getEntries() // Call the redis function getEntries() and return them to the client side
  res.status(200).json({ drones })
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})