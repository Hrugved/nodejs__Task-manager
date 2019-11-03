const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOne, userOneId,seedDatabase, userTwoTask} = require('./fixtures/db.js')

beforeEach(seedDatabase)

test('Should create task for the user', async () => {
    const response = await request(app)
                        .post('/tasks')
                        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                        .send({
                            description: 'welcome to jest'
                        })
                        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()                    
    expect(task.completed).toEqual(false)
})

test('Should get all tasks of the user', async () => {
    const response = await request(app)
                        .get('/tasks')
                        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)
    expect(response.body.length).toEqual(2)
})


test('Should not let user to delete other user\'s task', async() => {
    // userOne trying to delete userTwo's task 
    const response = await request(app)
                        .delete(`/tasks/${userTwoTask._id}`)
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(404)
    
    const task = Task.findById(userTwoTask._id)                    
    expect(task).not.toBeNull()
})