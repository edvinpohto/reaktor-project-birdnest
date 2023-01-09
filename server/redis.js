import * as dotenv from 'dotenv'
import { Client, Entity, Schema, Repository } from 'redis-om'

dotenv.config()

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
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
  const entry = repository.createEntity(data);
  const id = await repository.save(entry);

  const ttlInSeconds = 10 * 60  // Time to live: 10 minutes
  await repository.expire(id, ttlInSeconds)

  return id
}

export async function getEntries() {
  // Get entries from the db and return them
  // Called by an API endpoint on the main server
}