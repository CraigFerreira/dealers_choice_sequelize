const {syncAndSeed, People, Tasks}= require('./server.js')

const express= require('express');
const app= express();
const port = process.env.PORT || 3000;

const setup=async()=>{
    try{
        await syncAndSeed();
        app.listen(port, ()=>{
            console.log(`listening on port ${port}`)
        })
    }
    catch(err){
        console.log(err)
    }
}

setup()

app.get('/', async(request, response, next)=>{
    try{
        const people= await People.findAll()
        const tasks= await Tasks.findAll();
        response.send(`
        <html>
            <head></head>
            <body>
                <h1>Dealers Choice Sequelize</h1>
                <ul>
                    ${people.map((person)=>{
                        return `<li>${person.name}
                            <ul>
                                    ${tasks.map((task)=>{
                                        if(task.PersonId===person.id){
                                            let currTask=task.name;
                                            let currTaskId=task.id
                                            let currTaskDependancy=task.dependencyId;
                                            return `<li>
                                            ${task.name}
                                                <ul>
                                                    ${tasks.map((task)=>{ 
                                                        if(task.id===currTaskDependancy)
                                                        return  `<li style='list-style-type: none'>Dependant on : ${task.name}</li>`
                                                    }).join('')}
                                                </ul>
                                            </li>`  
                                        }
                                    }).join('')}  
                            </ul>
                        </li>`
                    }).join('')}
                <ul>
            </body>
        </html>
        `)
    }catch(err){
        next(err)
    }
})