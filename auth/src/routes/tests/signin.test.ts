import request from "supertest";
import {app} from "../../App";

it('should return a 400 with an invalid email on signin', function () {
    return request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test@.com',
            password: 'password'
        })
        .expect(400)
});

it('should return a 400 with missing email & password on signin', async function () {
    await request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com'
        })
        .expect(400)

    return request(app)
        .post('/api/auth/signin')
        .send({
            password: 'adsdfdsfdsf'
        })
        .expect(400)
});

it('should fail when email that does not exist is supplied on signin', async function () {
    await request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
});

it('should fail if incorrect password is supplied on signin', async function () {
    await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    await request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com',
            password: 'passwords'
        })
        .expect(400)

});

it('should  respond with a cookie when given valid credentials', async function () {
    await request(app)
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    const res = await request(app)
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)
    expect(res.get('Set-Cookie')).toBeDefined()
});
