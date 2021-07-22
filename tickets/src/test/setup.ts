import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import {app} from "../App";

declare global {
    function signup(): Promise<string[]>
}

let mongo: any

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
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})
afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signup = async () => {
    const email = 'test@test.com'
    const password = 'password'

    const res = await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    return res.get('Set-Cookie')
}
