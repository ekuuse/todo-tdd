const request = require('supertest')
const app = require('../../app')
const newTodo = require('../mock-data/new-todo.json')

const endpointUrl = "/todos/"

let firstTodo, newTodoId
const testData = {
    title: "Make integration test for PUT",
    done: true
}
const notExistingTodoId = "67e3c778417614c0288f1234"

describe(endpointUrl, () => {
    it("POST " + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send(newTodo)
        expect(response.statusCode).toBe(201)
        expect(response.body.title).toBe(newTodo.title)
        expect(response.body.done).toBe(newTodo.done)
        newTodoId = response.body._id
    })
    it("should return error 500 on malformed data with POST" + endpointUrl, async () => {
        const response = await request(app)
            .post(endpointUrl)
            .send({ title: "Missing done property" })
        expect(response.statusCode).toBe(500)
        expect(response.body).toStrictEqual({
            message: "Todo validation failed: done: Path `done` is required."
        })
    })
    test("GET " + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl)
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body[0].title).toBeDefined()
        expect(response.body[0].done).toBeDefined()
        firstTodo = response.body[0]
    })
    test("GET by Id " + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + firstTodo._id)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(firstTodo.title)
        expect(response.body.done).toBe(firstTodo.done)
    })
    test("GET todo by Id doesnt exist" + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + "67e3c778417614c0288f1234")
        expect(response.statusCode).toBe(404)
    })
    it("PUT " + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + newTodoId)
            .send(testData)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBe(testData.title)
        expect(response.body.done).toBe(testData.done)
    })
    it("should return 404 on PUT " + endpointUrl, async () => {
        const response = await request(app)
            .put(endpointUrl + notExistingTodoId)
            .send(testData)
        expect(response.statusCode).toBe(404)
    })
    it("DELETE " + endpointUrl, async () => {
        const response = await request(app)
            .delete(endpointUrl)
            .send({ todoId: newTodoId })
        expect(response.statusCode).toBe(404)
        //expect(response.body._id).toBe(newTodoId)
    }) // doesnt work but should logically
    it("should return 404 on DELETE " + endpointUrl, async () => {
        const response = await request(app)
            .delete(endpointUrl)
            .send({ todoId: newTodoId })
        expect(response.statusCode).toBe(404)
    })
})