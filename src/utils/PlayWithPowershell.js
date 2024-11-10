import { exec, spawn, spawnSync } from "node:child_process";
import path from "node:path";


export class PlayWithPowershell {

    #processRef = null;

    constructor(params = {}){

        const {
            source,
            volume = 0.2
        } = params;

        this.source = source;
        this.volume = volume;
    }

    play(){
        const file = path.join(import.meta.dirname, './play-with-powershell.ps1');

        this.#processRef = spawn('powershell', [
            file, 
            '-source', this.source,
            '-volume', this.volume
        ]);
    }

    stop(){

        if(this.#processRef){

            this.#processRef.kill();

            this.#processRef = null;
        }
    }
}


//MARK: Test
const themePath = path.join(import.meta.dirname, '../assets/tetris.wav');

const music = new PlayWithPowershell({source: themePath});

music.play()

setTimeout(() => {

    music.stop();

}, 7000);