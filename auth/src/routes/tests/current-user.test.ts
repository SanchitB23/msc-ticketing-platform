import {app} from "../../App";
import request from "supertest";

it('should respond with details of current user', async function () {
    const cookie = await global.signup()
    const res = await request(app)
        .get('/api/auth/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)
    expect(res.body.currentUser.email).toEqual('test@test.com')
});

it('should respond with null if not authenticated', async function () {
    const res = await request(app)
        .get('/api/auth/currentuser')
        .send()
        .expect(200)
    expect(res.body.currentUser).toEqual(null)
});
