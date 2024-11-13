import { spawn, } from "node:child_process";
import path from "node:path";


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

    play(){

        this.#processRef = spawn('vlc', [
            //'--intf', 'dummy', 
            '--no-volume-save', '--mmdevice-volume', this.volume,
            '--repeat', 
            this.source
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

    const themePath = path.join(import.meta.dirname, '../../../assets/tetris.wav');
    
    const music = new PlayWithVLC({source: themePath});
    
    music.play()
    
    setTimeout(() => {
    
        music.stop();
    
    }, 7000);
}

//test();