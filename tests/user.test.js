const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneId, badUser, seedDatabase} = require('./fixtures/db.js')

beforeEach(seedDatabase)

// test is provided to us globally by jest, so we dont need to import jest
test('Should sign up a user', async () => {
    const response = await request(app).post('/users').send({
        name: 'hrugved',
        email: 'hrugved@carrers.com',
        password: "pass123098"
    }).expect(201)
    
    // User is stored correctly into the database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user : {
            name: 'hrugved',
            email: 'hrugved@carrers.com'
        },
        token: user.tokens[0].token
    })

    // Password is stored correctly
    expect(user.password).not.toBe("pass123098")

})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        ...userOne
    }).expect(200)

    // assert new token is same for stored user and response
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        ...badUser
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app).get('/users/me')
            .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me')
            .send()
            .expect(401)
})

test('Should delete account for user', async () => {
    await request(app).delete('/users/me')
            .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

    // Assert user is deleted from database
    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})

test('Should not delete for unauthenticated user', async () => {
    await request(app).delete('/users/me')
            .send()
            .expect(401) // failed at auth middleware => 401
})

test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar','tests/fixtures/profile.jpg')
            .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) // use toEqual instead of toBe(same as ===), as {} === {} -> falsey        
})

test('Should update valid user fields', async () => {
    await request(app).patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name:'Michael'
            })
            .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Michael')
})

test('Should not update invalid user fields', async () => {
    await request(app).patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                tokens: []
            })
            .expect(400)
})