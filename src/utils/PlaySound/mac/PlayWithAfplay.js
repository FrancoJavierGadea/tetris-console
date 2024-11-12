import { exec, spawn, spawnSync } from "node:child_process";
import path from "node:path";


export class PlayWithAfplay {

    #processRef = null;

    constructor(params = {}){

        const {
            source,
            volume = 0.5
        } = params;

        this.source = source;
        this.volume = volume;
    }

    play(){

        this.#processRef = spawn('afplay', ['-v', this.volume, this.source]);

        this.#processRef.stdout.on('data', (data) => {

            //console.log(data.toString());
        });
        
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
    
    const music = new PlayWithAfplay({source: themePath});
    
    music.play()
    
    setTimeout(() => {
    
        music.stop();
    
    }, 7000);
}