// Using Redis and Redis OM to persist data created. https://redis.io/docs/stack/get-started/tutorials/stack-node/

import * as dotenv from 'dotenv'
import { Client, Entity, Schema, Repository } from 'redis-om'

dotenv.config()
const url = process.env.REDIS_URL; // Environmental variable for Redis DB connection

const client = new Client();

// Connect to client if client is not open.
async function connect() {
  if (!client.isOpen()) {
    await client.open(url);
  }
}

// Custom Entity and Schema for data
class Violator extends Entity {}
let schema = new Schema(
  Violator,
  {
    captureTime: { type: 'string' },
    serialNumber: { type: 'string' },
    positionX: { type: 'number' },
    positionY: { type: 'number' },
    distance: { type: 'number' },
    pilotId: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneNumber: { type: 'string' },
    createdDt: { type: 'string' },
    email: { type: 'string' },
  },
  {
    dataStructure: 'JSON'
  }
);

// Main function for data storage logic. 
// Generally, when a drone is found to violate the NDZ, the database is first queried with that drone's pilot id.
// If an entry with that id already exists, the record is updated. The record is also only updated if the new match's distance is closer than before.
// If the pilot does not already exist, a new entry is created.
export async function createViolatorEntry(data) {
  await connect();
  const repository = client.fetchRepository(schema);

  const pilotId = data.pilotId; // The pilot id for the drone (new) violating the NDZ
  const person = await repository.search().where('pilotId').equals(pilotId).return.all() // Fetch data with the pilotId of the violating drone
  
  // If the new violator already exists in the db, update data instead of creating a new entry.
  if (person.length > 0) {
    if (data.distance > person[0].distance) { // If the new distance is further than the old distance, immediately return.
      return
    }

    const personToUpdate = await repository.fetch(person[0].entityId) // Fetch data to be updated with entityId
    
    personToUpdate.captureTime = data.captureTime,
    personToUpdate.serialNumber = data.serialNumber,
    personToUpdate.positionX = data.positionX,
    personToUpdate.positionY = data.positionY,
    personToUpdate.distance = data.distance,
    personToUpdate.pilotId = data.pilotId,
    personToUpdate.firstName = data.firstName,
    personToUpdate.lastName = data.lastName,
    personToUpdate.phoneNumber = data.phoneNumber,
    personToUpdate.createdDt = data.createdDt,
    personToUpdate.email = data.email

    await repository.save(personToUpdate) // Save data update to DB

    const ttlInSeconds = 10 * 60  // Time to live: 10 minutes
    await repository.expire(personToUpdate.entityId, ttlInSeconds) // Refresh TTL for updated data

    return

  } else { // If the violating pilot did not exist in the database, create a new entry

    await repository.createIndex() // If index already exists, this is ignored automatically

    const entry = repository.createEntity(data);
    const id = await repository.save(entry);

    const ttlInSeconds = 10 * 60  // Time to live: 10 minutes
    await repository.expire(id, ttlInSeconds) // Set TTL

    return id
  }
}

// Function for data fetching for the client.
export async function getEntries() {
  // Get entries from the db and return them
  // Called by an API endpoint on the main server
  await connect();
  
  const repository = new Repository(schema, client)

  const drones = await repository.search().return.all() // Returns all data
  
  return drones
}