require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const routes= require('./routes/todoRoutes')


const app = express()
const port = process.env.PORT || 5001
app.use(cors())
app.use(express.json())
app.use('/api/todos', routes)




const startSever = async () => {
  try {
    await connectDB()
app.listen(port, () => {
  console.log('Server Is Running On Port', port)
})
    
  } catch (error) {
    console.log('Server Failed To Start', error)
    process.exit(1)
  }
}

startSever()

