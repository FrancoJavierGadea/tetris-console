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
        this.#processRef = spawn('aplay', ['-q', this.source]);
    }

    stop(){

        if(this.#processRef){

            console.log('STOP');

            this.#processRef.kill();

            this.#processRef = null;
        }
    }
}


//MARK: Test
// const themePath = path.join(import.meta.dirname, '../assets/tetris.wav');

// const music = new PlayWithAplay({source: themePath});

// music.play()

// setTimeout(() => {

//     music.stop();

// }, 7000);