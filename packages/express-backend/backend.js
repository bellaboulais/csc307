// backend.js
import e from "express";
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}); 

const users = { 
    users_list : [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
}
const findUserByName = (name) => { 
    return users['users_list']
        .filter( (user) => user['name'] === name); 
}

const findUserByNameJob = (name, job) => { 
    return (users['users_list']
        .filter( (user) => user['name'] === name))
        .filter( (user) => user['job'] === job); 
}

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    let result;
    if (name != undefined && job != undefined){
        result = findUserByNameJob(name, job);
        result = {users_list: result};
        res.send(result);
    }
    else if (name != undefined) {
        result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }
    else{
        res.send(users);
    }
});

const findUserById = (id) =>
    users['users_list']
        .find( (user) => user['id'] === id);
    
app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

function generateUserID() {
    return Math.floor(Math.random() * 1000);
}

const addUser = (user) => {
    user.id = generateUserID().toString();
    users['users_list'].push(user);
    return user;
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    let user = addUser(userToAdd);
    if(user) {
        res.status(201).json(user);
    }
    else {
        res.status(500).send("error adding user");
    }
});

const deleteUser = (id) => {
    let result = users['users_list'].find( (user) => user['id'] === id);
    if (result) {
        const num = users['users_list'].indexOf(result);
        users['users_list'].splice(num, 1);
    }
    return result;
}

app.delete('/users/:id/', (req, res) => {
    const id = req.params.id;
    let result = deleteUser(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.status(204).send(result);
    }
})

