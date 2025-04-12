import os from "node:os";
import { PlayWithPowershell } from "./powershell/PlayWithPowershell.js";
import { PlayWithAplay } from "./linux/PlayWithAplay.js";
import { PlayWithAfplay } from "./mac/PlayWithAfplay.js";
import { PlayWithVLC } from "./vlc/PlayWithVLC.js";

export function getDefaultPlayerSound(params){

    switch (os.platform()) {

        case 'win32':
            
            return new PlayWithPowershell(params);
    
        case 'linux':

            return new PlayWithAplay(params);

        case 'darwin':

            return new PlayWithAfplay(params);
    }
}

export function getPlayerSound(player, params){

    switch (player) {

        case 'powershell':
            
            return new PlayWithPowershell(params);
    
        case 'aplay':

            return new PlayWithAplay(params);

        case 'afplay':

            return new PlayWithAfplay(params);

        case 'vlc':
            
            return new PlayWithVLC(params);
    }
}

export {PlayWithAfplay, PlayWithPowershell, PlayWithVLC, PlayWithAplay}