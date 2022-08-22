const express = require('express')
const app = express()
const tasks = require('./routes/tasks')
const ConnectDB = require('./db/connect')
require('dotenv').config()
const notFound = require('./middleware/not_found')
const errorHandler = require('./middleware/error_handler')

//middleware
app.use(express.static('./public'))
app.use(express.urlencoded({extended : false}))
app.use(express.json()) //for using json


app.use('/api/v1/tasks',tasks) //routing

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3000

const start = async () => {
    try{
        
        await ConnectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server is listening on port ${port}...` )
        })

    }catch(error){
        
        console.log(error)
    }
}


start()


