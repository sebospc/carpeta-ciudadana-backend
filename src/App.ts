import express from 'express';
import CitizenController from './controller/Cityzen.controller';
import OrganizationController from './controller/Organization.controller';

export default class App {
    public app: express.Application;
    public port: number;

    // The constructor receives an array with instances of the controllers for the application and an integer to designate the port number.
    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers([new CitizenController(), new OrganizationController()]);
    }

    // Here we can add all the global middlewares for our application. (Those that will work across every contoller)
    private initializeMiddlewares() {
        this.app.use(express.json());
    }

    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    // Boots the application
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}