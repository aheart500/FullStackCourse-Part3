const mongoose = require('mongoose')
if(process.argv.length< 3){
    console.log('Please Enter your password')
    process.exit(1)
}
const password = process.argv[2]
const url =`mongodb+srv://Nasser:${password}@cluster0-gwux8.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url,{useNewUrlParser : true,useUnifiedTopology:true})
const personSchema = new mongoose.Schema({
    name : String,
    number : String,
})
const Person = mongoose.model('Person',personSchema)
if(process.argv.length === 3){
    Person.find({}).then((result)=>{
        console.log("Phonebook : ")
        result.forEach(person => console.log(`${person.name} : ${person.number}`))
        mongoose.connection.close()
    })
}else if (process.argv.length ===5){
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson = new Person({
        name : name,
        number: number
    })
    newPerson.save().then(()=>{
        console.log(`Added ${name} with number ${number} to phonebook `)
        mongoose.connection.close()
    })
}else{
    console.log('Please provide the name and the number')
    process.exit(1)
}
