import http from "node:http";

export class ServerLogger {

    #responses = new Set();

    constructor({port = 3300, path = '/logs'} = {}){

        this.port = port;
        this.path = path;

        this.server = http.createServer((request, response) => {

            if(request.url === this.path){

                response.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': '*'
                });

                response.write(`: Logs init\n\n`);

                this.#responses.add(response);

                request.on('close', () => {

                    this.#responses.delete(response);
                    response.end();
                });
            }
            else {

                response.writeHead(404);
                response.end();
            }
        });

        this.server.listen(this.port);
    }

    log(message, obj){

        if(this.#responses.size > 0){

            this.#responses.forEach((response) => {

                if(obj){
    
                    response.write(`data: ${message} ${JSON.stringify(obj)}\n\n`);
                }
                else {

                    response.write(`data: ${message}\n\n`);
                }
            });
        }
    }

    end(){

        this.#responses.forEach((response) => {

            response.end();
        });

        this.server.close();
    }
}