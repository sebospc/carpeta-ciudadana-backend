import 'reflect-metadata';

import { createConnection } from 'typeorm';
import cors from 'cors';
import * as config from '../config';



import App from './App';


createConnection().then(async connection => {
    console.log("connection done");
    connection.synchronize();

    const app = new App(config.app_port);


    app.app.use(cors());

    app.app.options('*', (req, res) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.send('ok');
    });

    app.app.use((req, res) => {
        res.set('Access-Control-Allow-Origin', '*');
    });

    app.listen();

}).catch(error => console.log(error));

