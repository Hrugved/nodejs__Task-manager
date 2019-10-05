require('../src/db/mongoose')
const Task = require('../src/models/task')

//        using promise-chaining       //
// Task.findByIdAndDelete('5d989a9a6cbe5d4bb4bd848e').then((task)=>{
//     console.log(task, 'deleted successfully')
//     return Task.countDocuments({completed:false})
// }).then((tasks)=>{
//     console.log(tasks)
// }).catch((e)=>{
//     console.log(e)
// })


//         using Async-Await          //
const deleteTaskAndCount = async (id) => { // 'await' is always used inside 'async' function
    const taskDeleted = await Task.findByIdAndDelete(id) // await : completely execute this line(async function call) and then proceed below
    // if any await function throws error -> no code below it is executed
    const taskCount = await Task.countDocuments({completed:false})
    return taskCount // async : functions always returns promise(of return value)
}  

deleteTaskAndCount('5d989ab36cbe5d4bb4bd848f').then((count) => {
    console.log(count)
}).catch((e)=>{
    console.log(e)
})