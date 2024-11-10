import os from "node:os";
import { PlayWithPowershell } from "./PlayWithPowershell.js";
import { PlayWithAplay } from "./PlayWithAplay.js";

export function getPlayerSound(params){

    switch (os.platform()) {

        case 'win32':
            
            return new PlayWithPowershell(params);
    
        case 'linux':

            return new PlayWithAplay(params);
    }
}