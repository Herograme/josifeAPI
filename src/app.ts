import express from "express";
//import cors from "cors";
//import helmet from "helmet";
import routes from "./routes";


class App {
    public express = express.application

    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
        this.errorHandler();
    }

    private middlewares(): void {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }))
        //this.express.use(cors())
        //this.express.use(helmet())
    }

    private routes(): void {
        this.express.get("/", (_req, res) => {
            res.send("Hello World");
        });

        this.express.use(routes)
    }


    private errorHandler(): void {
        this.express.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            res.status(500).json({
                error: err.message
            });
        });
    }
}


export default new App().express;