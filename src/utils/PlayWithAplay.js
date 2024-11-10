import { exec, spawn, spawnSync } from "node:child_process";
import path from "node:path";


export class PlayWithAplay {

    #processRef = null;

    constructor(params = {}){

        const {
            source
        } = params;

        this.source = source;
    }

    play(){
        const cmd = `aplay -q "${this.source}"`;

        this.#processRef = exec(cmd, (err, out) => {

            console.log(err, out);
        });
    }

    stop(){

        if(this.#processRef){

            console.log('STOP');

            this.#processRef.kill('SIGKILL');

            this.#processRef = null;
        }
    }
}


//MARK: Test
const themePath = path.join(import.meta.dirname, '../assets/tetris.wav');

const music = new PlayWithAplay({source: themePath});

music.play()

setTimeout(() => {

    music.stop();

}, 7000);