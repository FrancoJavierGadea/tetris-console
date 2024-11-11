import { exec, spawn, spawnSync } from "node:child_process";
import path from "node:path";


export class PlayWithPowershell {

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
        const file = path.join(import.meta.dirname, './play-with-powershell.ps1');

        this.#processRef = spawn('powershell', [
            '-File', file, 
            '-source', this.source,
            '-volume', this.volume.toString()
        ]);

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

    console.log('Test play sound with powershell');

    const themePath = path.join(import.meta.dirname, '../../../assets/tetris.wav');

    console.log(`\nFile: ${themePath}`);
    
    const music = new PlayWithPowershell({source: themePath});
    
    music.play()
    
    setTimeout(() => {
    
        music.stop();
    
    }, 7000);
}
