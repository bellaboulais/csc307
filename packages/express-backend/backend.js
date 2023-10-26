// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services";

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

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    userServices.getUsers(name, job)
        .then(users => {
            res.json({ users_list: users });
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
    
app.get('/users/:id', (req, res) => {
    const id = req.params.id; 
    userServices.findUserById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send("Resource Not Found");
            }
            res.send(user);
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    userServices.addUser(userToAdd)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.delete('/users/:id/', (req, res) => {
    const id = req.params.id;
    userServices.deleteUserById(id)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).send("Resource Not Found");
            }
            res.status(204).send(deletedUser);
        })
        .catch(error=> {
            res.status(500).json({ error: 'Internal Server Error' });
        });
})

