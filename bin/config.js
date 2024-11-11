
const CONFIG = [
    {
        name: '--version',
        alias: '-v',
        type: 'boolean'
    },
    {
        name: '--help',
        alias: '-h',
        type: 'boolean'
    },
    {
        name: '--volume',
        alias: '-V',
        type: 'number'
    },
];


export function getConfig(){

    const args = process.argv.slice(2);
    
    //console.log(args);
    
    const config = CONFIG.reduce((acc, arg) => {
    
        const {name, alias, type} = arg;
    
        let index = -1;

        for (const value of [name, alias]) {

            if(args.includes(value)){

                index = args.findIndex((item) => item === value);
                break;
            }
        }
    
        if(index !== -1){
    
            if(type === 'boolean'){
    
                acc[name] = true;
            }
    
            if(type === 'number'){
    
                acc[name] = args.at(index + 1) && Number(args.at(index + 1));
            }
        }
    
        return acc;
    
    }, {});
    
    return config;
}

