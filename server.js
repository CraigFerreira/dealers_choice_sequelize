const {Sequelize, DataTypes, UUID, UUIDV4} = require('sequelize')
const pg=require('pg')
const db =new Sequelize(process.env.DATABASE_URL ||'postgres://localhost/tasks_db', {logging:false})

const test=async()=>{
    try{
    await db.authenticate();
    console.log('database connected')
    } catch(err){
        console.error('connection failed',err)
    }
}

test()

const People= db.define('People',{
    name:{type: DataTypes.STRING, allowNull: false},
    id:{type: UUID, primaryKey: true, defaultValue: UUIDV4},
    occupation:{type: DataTypes.STRING, allowNull: false}
})

const Tasks=db.define('Tasks',{
    name:{type: DataTypes.STRING, allowNull: false},
    id:{type: UUID, primaryKey: true, defaultValue: UUIDV4},
    dependencies:{type: DataTypes.STRING, allowNull:true, defaultValue: 'none'}
})

Tasks.belongsTo(People);
 

Tasks.belongsTo(Tasks, {as: 'dependency'})


const syncAndSeed=async()=>{
        await People.sync({force: true})
        await Tasks.sync({force:true})
        const harry=await People.create({name: 'Harry', occupation:'retailer'})
        const john= await People.create({name:'John',occupation:'banker' })
        const andrew= await People.create({name: 'Andrew', occupation:'accountant'})
    
        const bakeCake= await Tasks.create({name:'bake cake', dependencies: 'buy cake ingredients'})
        const buyCakeIngredients= await Tasks.create({name: 'buy cake ingredients'})
        const walkDog= await Tasks.create({name: 'walk the Dog'})
        const completeWorkProject= await Tasks.create({name:'complete work project'})
        const vacation= await Tasks.create({name:'go on vacation', dependencies: 'complete work project'})
        const attendGraduation= await Tasks.create({name:'attend graduation', dependencies:'pass exam'})
        const passExam =await Tasks.create({name: 'pass the exam', dependencies:'study for exam'})
        const studyForExam= await Tasks.create({name: 'study for exam'})
    
        bakeCake.PersonId= harry.id;
        buyCakeIngredients.PersonId=harry.id;
        walkDog.PersonId=john.id;
        completeWorkProject.PersonId=andrew.id;
        vacation.PersonId= andrew.id;
        attendGraduation.PersonId=andrew.id;
        passExam.PersonId=andrew.id;
        studyForExam.PersonId=andrew.id;
    
        bakeCake.dependencyId= buyCakeIngredients.id;
        vacation.dependencyId= completeWorkProject.id;
        attendGraduation.dependencyId= passExam.id;
        passExam.dependencyId=studyForExam.id
        // await passExam.update({dependencyId: studyForExam.id})
        await Promise.all([bakeCake.save(), buyCakeIngredients.save(), walkDog.save(), completeWorkProject.save(), vacation.save(),
            attendGraduation.save(), passExam.save(), studyForExam.save(), 
        ]) 
}



module.exports={
    syncAndSeed, People, Tasks
}