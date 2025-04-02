const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../models/todo.model')
const httpMocks = require("node-mocks-http")
const newTodo = require('../mock-data/new-todo.json')
const allTodos = require('../mock-data/all-todos.json')

TodoModel.create = jest.fn()
TodoModel.find = jest.fn()
TodoModel.findById = jest.fn()
TodoModel.findByIdAndUpdate = jest.fn()
TodoModel.findByIdAndDelete = jest.fn()

const todoId = "67e3c778417614c0288f0389"

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn() // green fn ✅
}) 

describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo
    })

    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function')
    })
    it('should call TodoModel.create', () => {
        TodoController.createTodo(req, res, next)
        expect(TodoModel.create).toBeCalledWith(newTodo)
    })
    it('should return 201 response code', async () => {
        await TodoController.createTodo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should return json body in response', async () => {
        await TodoModel.create.mockReturnValue(newTodo)
        await TodoController.createTodo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it('should handle errors', async () => {
        const errorMessage = { message: "Done property is done missing"}
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.create.mockReturnValue(rejectedPromise)
        await TodoController.createTodo(req, res, next)
        expect(next).toBeCalledWith(errorMessage)
    })
})

describe('TodoController.getTodos', () => {
    it('should have a getTodos function', () => {
        expect(typeof TodoController.getTodos).toBe('function')
    })
    it('should call TodoModel.find', () => {
        TodoController.getTodos(req, res, next)
        expect(TodoModel.find).toBeCalledWith({})
    })
    it('should return response with status 200 and all todos', async () => {
        TodoModel.find.mockReturnValue(allTodos)
        await TodoController.getTodos(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allTodos)
    })
    it('should handle errors in getTotus', () => {
        // :D
    })
})

describe('TodoController.getTodoById', () => {
    it('should have a getTodoByIds function', () => {
        expect(typeof TodoController.getTodoById).toBe('function')
    })
    it('should call TodoModel.findById with route parameters', async () => {
        req.params.todoId = "67e3c778417614c0288f0389"
        await TodoController.getTodoById(req,res,next)
        expect(TodoModel.findById).toBeCalledWith("67e3c778417614c0288f0389")
    })
    it('should return response with status 200 and requested todo', async () => {
        const mockTodo = {
            _id: "67e3c778417614c0288f0389",
            title: "Prepare manual test",
            done: false,
            __v: 0
        }
        req.params = { todoId: "67e3c778417614c0288f0389" }
        TodoModel.findById.mockResolvedValue(mockTodo);
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(mockTodo)
    })
    it('should do error handling and not error by itself', async () => {
        const errorMessage = { message: "error finding todoModel" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findById.mockReturnValue(rejectedPromise)
        await TodoController.getTodoById(req,res,next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
    it('should return 404 when item doesnt exist', async () => {
        TodoModel.findById.mockReturnValue(null)
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe('TodoController.updateTodo', () => {
    it('should have a updateTodo function', () => {
        expect(typeof TodoController.updateTodo).toBe('function')
    })
    it('should update with TodoModel.findByIdAndUpdate', async () => {
        req.params.todoId = todoId
        req.body = newTodo
        await TodoController.updateTodo(req,res,next)
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
            new: true,
            useFindAndModify: false
        })
    })
    it('should return a response with json data and http code 200', async () => {
        req.params.todoId = todoId
        req.body = newTodo
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo)
        await TodoController.updateTodo(req,res,next)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it('should do error handling and not error by itself', async () => {
        const errorMessage = { message: "Error" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
        await TodoController.updateTodo(req,res,next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
    it('should return 404', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null)
        await TodoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})

describe('TodoController.deleteTodo', () => {
    it('should have a deleteTodo function', () => {
        expect(typeof TodoController.deleteTodo).toBe('function')
    })
    it('should delete todo', async () => {
        req.body.todoId = todoId
        TodoModel.findByIdAndDelete.mockReturnValue({_id: todoId})
        await TodoController.deleteTodo(req,res,next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual({ message: 'Todo deleted successfully' });
    })
    it('couldnt get to delete todo because no todo found', async () => {
        req.body.todoId = "xd"
        TodoModel.findByIdAndDelete.mockReturnValue(null)
        await TodoController.deleteTodo(req,res,next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
})