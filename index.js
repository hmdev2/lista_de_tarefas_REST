import express, { Router } from 'express';

const app = express();
const port = 3001;
const tasks = [];

app.use(express.json());

class Controller {
    async index(req, res) {
        res.json('tudo funcionando');
    }
    
    async store(req, res) {
        try{
            const task = req.body;

            
            task.id = tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1;

            if(!task.task) throw new Error('Defina uma tarefa');
            if(typeof task.task !== 'string') throw new Error('Defina uma tarefa válida');

            tasks.push(task);

            res.status(201).json(task);

        }catch(err) {
            res.status(400).json({error: err.message});
        }
    };

    async show(req, res) {
        try {
            if(tasks.length === 0) throw new Error('Não existem tarefas');

            res.status(200).json(tasks);

        } catch(err) {
            res.status(404).json({error: err.message});
        }
    };

    async del(req, res) {
        try {
            const id = parseInt(req.query.id);
            const index = tasks.findIndex(task => task.id === id);

            if(index !== -1) {
                const delTask = tasks.splice(index, 1)[0];
                return res.status(200).json(delTask);
            } 

            throw new Error('Esta tarefa não existe');

        } catch(err) {
            res.status(404).json({error: err.message});
        }
    };

    async update(req, res) {
        try {
            const id = parseInt(req.query.id);
            const index = tasks.findIndex(task => task.id === id);

            if(index === -1) throw new Error('Esta tarefa não existe');
            
            const task = req.body.task;

            if(!task) throw new Error('Defina uma tarefa');
            if(typeof task !== 'string') throw new Error('Defina uma tarefa válida');
            
            tasks[index].task = task;

            res.status(200).json(tasks[index]);

        } catch(err) {
            res.status(404).json({error: err.message});
        }
    };
};

const controller = new Controller();

const routes = Router();

routes.get('/', controller.index);
routes.get('/tasks', controller.show);
routes.post('/tasks', controller.store);
routes.delete('/tasks', controller.del);
routes.put('/tasks', controller.update);

app.use('/', routes);

app.listen(port, () => console.log(`express runnig in http://localhost:${port}, press ctrl+c for stop the server`));