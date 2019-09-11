require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

mongoose.connect(url,{useNewUrlParser : true,useUnifiedTopology:true}).then(result =>{
    console.log('Connected to the database')
}).catch(error => {
    console.log('Error connection to the db',error.message)
})


const personSchema = new mongoose.Schema({
    name : {type : String, unique : true, minlength :8, required: true},
    number : {type : String,required:true}
})
personSchema.plugin(uniqueValidator)


personSchema.set('toJSON',{
    transform : (doc,ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person',personSchema)



