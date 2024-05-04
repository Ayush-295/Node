const express=require('express');
const users=require('./MOCK_DATA.json');


const app = express();
const port = 3000;

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

app.get('/users/:id',(req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=>     //When a function doesnt return anything it has to be without curly braces else the webpage doesnt get loaded
        user.id==id
    );
    return res.json(user);
})


app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});

