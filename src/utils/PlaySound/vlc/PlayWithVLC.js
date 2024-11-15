import { spawn, } from "node:child_process";
import path from "node:path";
import http from "node:http";


async function getFreePort(){

    const server = http.createServer();

    const {resolve, reject, promise} = Promise.withResolvers();

    server.listen(0, () => {

        resolve(server.address().port);

        server.close();
    });

    server.on('error', () => {

        reject();
    });

    return promise;
}

async function setVolume({url, password, value} = {}) {

    const request = url + '?' + new URLSearchParams({
        'command': 'volume',
        'val': value
    })
    .toString();

    const response = await fetch(request, {
        method: 'GET',
        headers: { 'Authorization': `Basic ${btoa(`:${password}`)}` }
    });
}

async function tooglePause({url, password} = {}) {
    
    const request = url + '?' + new URLSearchParams({
        'command': 'pl_pause'
    })
    .toString();

    const response = await fetch(request, {
        method: 'GET',
        headers: { 'Authorization': `Basic ${btoa(`:${password}`)}`}
    });
}

//MARK: PlayWithVLC
export class PlayWithVLC {

    #processRef = null;

    constructor(params = {}){

        const {
            source,
            volume = 0.5
        } = params;

        this.source = source;
        this.volume = volume;
    }

    async play(){

        const port = await getFreePort();
        const host = '127.0.0.1';
        const password = '1812';

        const url = new URL(`http://${host}:${port}/requests/status.xml`);

        this.#processRef = spawn('vlc', [
            '--intf', 'dummy', 
            '--extraintf', 'http',
            '--http-host', host, 
            '--http-port', port, 
            '--http-password', password,
            '--repeat',
            '--start-paused', 
            this.source
        ]);

        this.#processRef.stdout.on('data', async (data) => {

            //console.log(data.toString());
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await setVolume({url, password, value: parseInt(256 * this.volume)});

        await tooglePause({url, password});

        
        const cmd = this.#processRef.spawnargs.join(' ');

        //console.log(cmd);
    }

    stop(){

        if(this.#processRef){

            this.#processRef.kill();

            this.#processRef = null;
        }
    }
}


//MARK: Test
export function test(){

    const themePath = path.join(import.meta.dirname, '../../../assets/tetris.wav');
    
    const music = new PlayWithVLC({source: themePath});
    
    music.play()
    
    setTimeout(() => {
    
        music.stop();
    
    }, 17000);
}

//test();