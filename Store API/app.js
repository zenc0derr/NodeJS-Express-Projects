require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

//middlwares - built in
app.use(express.json())

//middlewares- custom


//routes

app.get('/',(req,res)=>{
    res.send('<h1>Store API</hd1><a href="/api/v1/products/">products route</a>')
})

app.use('/api/v1/products',productsRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log(`Server is listening at port: ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()