const mongoose = require('mongoose')

const connectionString = ''


const connectDB = (uri) => {
    return mongoose.connect(uri,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
}

module.exports = connectDB