const express = require('express')
const upload = require('../middleware/upload')

const {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodo
} = require('../controller/todoController')

const router = express.Router()

router
.get('/', getTodo)
.post('/', upload.single('image'), createTodo)
.put('/:id', upload.single('image'), updateTodo)
.delete('/:id', deleteTodo)

module.exports = router;