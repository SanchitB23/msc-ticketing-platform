import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {sign} from "jsonwebtoken";

declare global {
    function signin(id?: string): string[]
}

jest.mock('../nats-wrapper')

let mongo: any

    process.env.STRIPE_KEY = "sk_test_51JTm2NSAyHSyVuXyiEQSHXd5x005PCqCEAT0KnN3eEnmbtCqbo9e6MP7qhsJf2QdWzZQxZ8Qg72smUX6a5aBLPQ9006b9QlRCd"
beforeAll(async () => {
    process.env.JWT_KEY = "dsfsdf"
    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})
afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = (id?: string) => {
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    }

    const token = sign(payload, process.env.JWT_KEY!)
    const session = {jwt: token}
    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')
    return [`express:sess=${base64}`]

}
