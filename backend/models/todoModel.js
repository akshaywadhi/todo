const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  title : {type : String, required : true},
  desc : String,
  image : {
    url : String,
    p_id : String
  }

},
{timestamps : true}
)


const todoModel = mongoose.model('todos', todoSchema)

module.exports = todoModel