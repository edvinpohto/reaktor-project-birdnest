import * as dotenv from 'dotenv'
import { Client, Entity, Schema, Repository } from 'redis-om'

dotenv.config()
const url = process.env.REDIS_URL;

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(url);
  }
}

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

export async function createViolatorEntry(data) {
  await connect();
  const repository = client.fetchRepository(schema);

  const pilotId = data.pilotId;
  const person = await repository.search().where('pilotId').equals(pilotId).return.all()
  
  // If the da
  if (person.length > 0) {
    if (data.distance > person[0].distance) {
      return
    }

    console.log("update", person[0].lastName)
    const personToUpdate = await repository.fetch(person[0].entityId)
    
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

    await repository.save(personToUpdate)

    const ttlInSeconds = 10 * 60  // Time to live: 10 minutes
    await repository.expire(personToUpdate.entityId, ttlInSeconds)

    return
  } else {
    console.log("new", data.lastName)

    await repository.createIndex()

    const entry = repository.createEntity(data);
    const id = await repository.save(entry);

    const ttlInSeconds = 10 * 60  // Time to live: 10 minutes
    await repository.expire(id, ttlInSeconds)

    return id
  }
}

export async function getEntries() {
  // Get entries from the db and return them
  // Called by an API endpoint on the main server
  await connect();
  
  const repository = new Repository(schema, client)

  const drones = await repository.search().return.all()
  
  return drones
}



// Old version, keep this for safety
// const repository = client.fetchRepository(schema);
// await repository.createIndex()

// const entry = repository.createEntity(data);
// const id = await repository.save(entry);

// const ttlInSeconds = 10 * 60  // Time to live: 10 minutes
// await repository.expire(id, ttlInSeconds)

// return id