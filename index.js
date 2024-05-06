const express=require('express');
const users=require('./MOCK_DATA.json');
const fs=require('fs');

const app = express();
const port = 3000;

//Middleware-Plugin
app.use(express.urlencoded({extended:false}))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users',(req,res)=>{
    const html=`
    <ul>${users.map((user)=>
        `<li>${user.first_name}</li>`
    ).join("")}</ul>
    `
    res.send(html);
})

app.get('/api/users',(req,res)=>{
    return res.json(users);
})
app.get('/api/users/:id',(req,res)=>{
    const id=Number(req.params.id);
        const user=users.find((user)=>     //When a function doesnt return anything it has to be without curly braces else the webpage doesnt get loaded
            user.id==id
        );
        return res.json(user);
})

app.route("/users/:id")
    .get((req,res)=>{
        const id=Number(req.params.id);
        const user=users.find((user)=>     //When a function doesnt return anything it has to be without curly braces else the webpage doesnt get loaded
            user.id==id
        );
        return res.json(user);
    })
    
    .patch((req,res)=>{
        //Edit user with id here
        res.json({status:"pending"})
    })
    .delete((req,res)=>{
        //delete user with id here
        res.json({status:"pending"})
    })
app.post("/api/users",(req,res)=>{
    const body=req.body;
    users.push({...body,id:users.length+1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.json({status:"Success",id:users.length+1});
    });
})

//This makes it easy to handle rather than the method written below

// app.get('/users/:id',(req,res)=>{
//     const id=Number(req.params.id);
//     const user=users.find((user)=>     //When a function doesnt return anything it has to be without curly braces else the webpage doesnt get loaded
//         user.id==id
//     );
//     return res.json(user);
// })


// app.post("/api/users",(req,res)=>{
//     //Create new user here
//     res.json({status:"pending"})
// })

// app.patch("/api/users/:id",(req,res)=>{
//     //Edit user with id here
//     res.json({status:"pending"})
// })

// app.delete("/api/users/:id",(req,res)=>{
//     //delete user with id here
//     res.json({status:"pending"})
// })

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});

