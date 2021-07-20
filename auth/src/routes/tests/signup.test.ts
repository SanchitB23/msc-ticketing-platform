import request from "supertest";
import {app} from "../../App";

it('returns a 201 on success signup', async () => {
    return request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
})

it('should return a 400 with an invalid email on signup', function () {
    return request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@.com',
            password: 'password'
        })
        .expect(400)
});

it('should return a 400 with an invalid password on signup', function () {
    return request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'a'
        })
        .expect(400)
});

it('should return a 400 with missing email & password on signup', async function () {
    await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400)

    return request(app)
        .post('/api/auth/signup')
        .send({
            password: 'adsdfdsfdsf'
        })
        .expect(400)
});

it('should not allow duplicate emails on signup', async function () {
    await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
});

it('should set a cookie after success signup', async function () {
    const res = await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    expect(res.get('Set-Cookie')).toBeDefined()
});
