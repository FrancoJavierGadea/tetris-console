import os from "node:os";
import { PlayWithPowershell } from "./powershell/PlayWithPowershell.js";
import { PlayWithAplay } from "./linux/PlayWithAplay.js";

export function getPlayerSound(params){

    switch (os.platform()) {

        case 'win32':
            
            return new PlayWithPowershell(params);
    
        case 'linux':

            return new PlayWithAplay(params);
    }
}