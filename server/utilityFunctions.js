import { createViolatorEntry } from './redis.js';
import { XMLParser } from 'fast-xml-parser';
import { fetch } from 'undici';

const droneUrl = 'https://assignments.reaktor.com/birdnest/drones'
const pilotUrl = 'https://assignments.reaktor.com/birdnest/pilots/'

// Function to get drones from the provided endpoint
// Parses the XML file with fast-xml-parser
export async function getDrones() {
  const options = {
    ignoreAttributes: false,
  };
  const parser = new XMLParser(options)
  const xml = await fetch(droneUrl)
  const txt = await xml.text()
  const json = await parser.parse(txt)
  return json.report.capture
}

// Function to get pilots violating the NDZ from the provided endpoint
// Only called if violation found (server.js)
export async function getPilot(serialNumber) {
  const res = await fetch(pilotUrl + serialNumber.toString())
  const json = await res.json()

  return json
}

// Simple function to send data to be created at redis.js
export async function sendDataToDb(data) {
  await createViolatorEntry(data);
}

// Function to check for violations
// Uses the Pythagorean theorem (d = Math.sqrt((Xpoint - Xcenter) ** 2 + (Ypoint - Ycenter) ** 2)) to check if 
// a given point is within the circle or not. If distance (d) <= radius (r), then the point is inside the circle.
// https://math.stackexchange.com/a/198769
export function droneIsViolatingNDZ(x, y) {
  const originX = 250000
  const originY = 250000
  const radius = 100000

  const distance = Math.sqrt((x - originX) ** 2 + (y - originY) ** 2);

  if (distance <= radius) {
    return  [ true, distance ]
  } else {
    return false
  }
}