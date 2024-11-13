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

    #aplayProcessID = null;

    play(){

        const file = path.join(import.meta.dirname, './play-with-aplay.sh');

        this.#processRef = spawn(file, ['--source', this.source]);

        this.#processRef.stdout.on('data', (data) => {

            this.#aplayProcessID = Number(data.toString());

            //console.log(this.#aplayProcessID);
        });
        
        const cmd = this.#processRef.spawnargs.join(' ');

        //console.log(cmd);
    }

    stop(){

        if(this.#processRef){

            //console.log('STOP');

            //Kill bash script process
            this.#processRef.kill();

            this.#processRef = null;

            //Kill aplay process
            if(this.#aplayProcessID){

                process.kill(this.#aplayProcessID);

                this.#aplayProcessID = null;
            };

        }
    }
}


//MARK: Test
export function test(){

    const themePath = path.join(import.meta.dirname, '../../../assets/tetris.wav');
    
    const music = new PlayWithAplay({source: themePath});
    
    music.play()
    
    setTimeout(() => {
    
        music.stop();
    
    }, 10*60*1000);
}

//test();