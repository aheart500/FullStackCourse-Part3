require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3001
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/Person')
morgan.token('reqBody', (req,res)=>{
    return JSON.stringify(req.body)
})

/* let persons = [
    {
        name : "Arto Hellas",
        number : '040-123456',
        id : 1
    },{
        name : 'Ada Lovelace',
        number : '39-44-5323523',
        id : 2,
    },{
        name : "Mohamed Nasser",
        number : '01149707289',
        id : 3
    },{
        name: "Hamza Nasser",
        number : '0105060728292',
        id : 4
    },
    {
        name: "Franz Bonaparta",
        number: "01127341338",
        id: 5
    },
    {
        name: "Sayed Atwa",
        number: "01149707289",
        id: 6
    }
]
 */
app.use(express.static('build'))
app.use(bodyParser.json())

app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))


app.get('/api/persons',(req,res)=>{
    Person.find({}).then(persons=>{
        res.json(persons.map(person => person.toJSON()))
    })
})


app.get('/info',(req,res)=>{
    Person.find({}).then(result=>{
        const message = `Phonebook has info for ${result.length} people`
        const date = new Date()
        res.send(`<h2> ${message} </h2><h3> ${date} </h3>`)
    }) 
})

app.get('/api/persons/:id',(req,res,next)=>{
    
    Person.findById(req.params.id).then(person => {
        if(person){
            res.json(person.toJSON())
        }else{
            res.status(404).end()
        }
        
    }).catch(error => {
        next(error)
    })
    
})


app.delete('/api/persons/:id',(req,res,next)=>{
    Person.findByIdAndRemove(req.params.id).then(result =>{
        res.status(204).end()
    }).catch(error => next(error))
})


app.post('/api/persons',(req,res,next)=>{
    const sentPerson = req.body
    
    const newPerson = new Person({
        name : sentPerson.name,
        number : sentPerson.number,
    })
    newPerson.save().then(result => {
        res.json(result.toJSON())
        console.log('Added successfuly')
    }).catch(error => next(error))
    
})

app.put('/api/persons/:id',(req,res,next)=>{
    const sentPerson = req.body
    const updatedPerson = {
        name : sentPerson.name,
        number : sentPerson.number
    }
    Person.findByIdAndUpdate(req.params.id,updatedPerson,{new : true}).then(updatedPerson => {
        res.json(updatedPerson.toJSON())
    }).catch(error => next(error))
})
const unknowEndpoint = (req,res)=>{
    res.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error,req,res,next)=>{
    console.error(error.message)
    if(error.name === 'CastError' && error.kind === 'ObjectId'){
        return res.status(400).send({error : "Malformed Id"})
    }else if(error.name==='ValidationError'){
        return res.status(400).send({error : error.message})
    }
    next(error)
}
app.use(errorHandler)
app.use(unknowEndpoint)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})


