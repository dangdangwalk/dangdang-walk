import { IncomingMessage, ServerResponse } from 'http';

export class Controller {
    public handleRequest(req: IncomingMessage, res: ServerResponse): void {
        if (req.url === '/weather' && req.method === 'GET') {
            this.getWeather(req, res);
        } else {
            this.notFound(req, res);
        }
    }

    private getWeather(req: IncomingMessage, res: ServerResponse) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('connected');
        res.end();
    }

    private notFound(req: IncomingMessage, res: ServerResponse): void {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ err: 'Not Found' }));
    }
}

export async function getControllerInstance() {
    return new Controller(await getDataInstance(), await getWeatherServiceInstance(), getLogger());
}
