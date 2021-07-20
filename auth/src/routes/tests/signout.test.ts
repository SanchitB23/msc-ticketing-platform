import {app} from "../../App";
import request from "supertest";

it('should clear cookie upon signout', async function () {
    await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    const res = await request(app)
        .post('/api/auth/signout')
        .send({})
        .expect(200)
    expect(res.get('Set-Cookie')).toBeDefined()
});
