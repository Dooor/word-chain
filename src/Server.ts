import express from 'express';
import findFreePort from 'find-free-port';
import * as http from 'http';
import morgan from 'morgan';
import cors from 'cors';
import { HTTPError } from './model/HTTPError';

export class Server {
    private readonly app: express.Express;
    private startPromise: Promise<http.Server> | null = null;

    constructor() {
        this.app = express();
        this.app.use(express.json());
		this.app.use(morgan('combined'));
		this.app.use(cors());

        this.app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
            let httpError: HTTPError;
            if (err instanceof HTTPError) {
                httpError = err;

            } else {
                httpError = HTTPError.InternalServerError();
            }

            if (httpError.statusCode > 500 && httpError.statusCode < 600) {
                console.error(err);
            }

            res.status(httpError.statusCode)
                .send({
                    code: httpError.statusCode,
                    message: httpError.message
                });
        });
    }

    async getAddress(): Promise<string> {
        if (!this.startPromise) {
            return '';
        }

        const server = await this.startPromise;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return `localhost:${ (server.address() as any).port }`;
    }

    async start(): Promise<http.Server> {
        return this.startPromise = new Promise<http.Server>(resolve => {
            findFreePort(Number(process.env.PORT) || 3000, (err, port) => {
                const server = this.app.listen(port, () => {
                    resolve(server);
                });
            });
        });
    }

    async stop(): Promise<{} | void> {
        if (!this.startPromise) {
            return;
        }

        const server = await this.startPromise;
        return new Promise(resolve => {
            server.close(() => resolve());
        });
    }
}
