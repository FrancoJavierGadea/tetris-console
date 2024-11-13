#!/bin/bash

# Read flags
while test $# -gt 0; do

    case "$1" in

        --source|-s)
            shift
            source=$1
            shift
        ;;

        *)
            echo "$1 is no supported flag"
            return 1;
        ;;
    esac
done

#echo "Source is: $source"


while true 
do

    aplay -q "$source" &
    aplay_pid=$!

    echo "$aplay_pid"

    wait $aplay_pid

done


