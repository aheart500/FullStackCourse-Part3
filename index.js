const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3001
const cors = require('cors')
const morgan = require('morgan')

morgan.token('reqBody', (req,res)=>{
    return JSON.stringify(req.body)
})

let persons = [
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

app.use(express.static('build'))
app.use(bodyParser.json())

app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))


app.get('/api/persons',(req,res)=>{
    res.json(persons)
})


app.get('/info',(req,res)=>{
    const message = `Phonebook has info for ${persons.length} people`
    const date = new Date()
    res.send(`<h2> ${message} </h2><h3> ${date} </h3>`)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(!person){
        res.status(404).send("<h1>No person is saved with this id. please try another id</h1>")
    }else{
        res.json(person)
    }
    
})


app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id )
    res.status(204).end()
})


app.post('/api/persons',(req,res)=>{
    const generateId=()=>{
        const maxId = Math.max(...persons.map(person=> person.id))
        return maxId+1
    }
    const sentPerson = req.body
    if (!sentPerson.name){
       return res.status(400).json({error : "You must provide a name for the new contact"})
    }
    if (!sentPerson.number){
       return res.status(400).json({error : "You must provide a number for the new contact"})
    }
    const savedNames = persons.map(person => person.name)
    if(savedNames.includes(sentPerson.name)){
        return res.status(400).json({error : `${sentPerson.name} already exists in the contacts list`})
    }
    const newPerson = {
        name : sentPerson.name,
        number : sentPerson.number,
        id : generateId()
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
})



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})


