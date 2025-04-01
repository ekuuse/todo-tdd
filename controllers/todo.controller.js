const TodoModel = require('../models/todo.model')

const createTodo = async (req, res, next) => {
    try {
        const createdModel = await TodoModel.create(req.body)
        res.status(201).json(createdModel)
    } catch(error) {
        next(error)
    }
}

const getTodos = async (req, res, next) => {
    const allTodos = await TodoModel.find({})
    res.status(200).json(allTodos)
}

const getTodoById = async (req, res, next) => {
    try {
        const todoModel = await TodoModel.findById(req.params.todoId)
        if (todoModel) {
            res.status(200).json(todoModel)
        } else {
            res.status(404).send()
        }
    } catch {
        next(error)
    }
}

module.exports = {createTodo, getTodos, getTodoById}