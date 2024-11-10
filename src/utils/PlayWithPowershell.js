import { exec, spawn, spawnSync } from "node:child_process";
import path from "node:path";


export class PlayWithPowershell {

    #processRef = null;

    constructor(params = {}){

        const {
            source
        } = params;

        this.source = source;
    }

    play(){
        const cmd = `powershell -c while($true){(New-Object Media.SoundPlayer "${this.source}").PlaySync();}`;

        this.#processRef = exec(cmd, (err, out) => {

            console.log(err, out);
        });
    }

    stop(){

        if(this.#processRef){

            spawnSync("taskkill", ["/pid", this.#processRef.pid, '/f', '/t']);

            this.#processRef = null;
        }
    }
}


//MARK: Test
// const themePath = path.join(import.meta.dirname, '../assets/tetris.wav');

// const music = new PlayWithPowershell({source: themePath});

// music.play()

// setTimeout(() => {

//     music.stop();

// }, 7000);