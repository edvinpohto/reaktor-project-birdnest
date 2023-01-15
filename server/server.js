import express from 'express';
import cors from 'cors';
import { droneIsViolatingNDZ, getDrones, getPilot, sendDataToDb } from './utilityFunctions.js'
import { getEntries } from './redis.js';

const app = express()
app.use(cors());
const port = 3000

let prevDistance;

// Fetches drone data every 2 seconds
setInterval(async function () {
  let capture = await getDrones()

  for (const drone of capture.drone) {
    const violation = droneIsViolatingNDZ(drone.positionX, drone.positionY)
    if (violation[0]) {
      console.log("Found one!", "X position:", drone.positionX, "Y position:", drone.positionY)

      const pilot = await getPilot(drone.serialNumber)
    
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

      if (prevDistance != violation[1]) {
        sendDataToDb(mergedData)
        prevDistance = violation[1]
      }
    }
  }
}, 2000); // CHANGE THIS TO 2000 for production

app.get('/getDrones', async (req, res, err) => {
  // Call the redis function getEntries() and return them to the client side
  const drones = await getEntries()
  res.status(200).json({ drones })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})