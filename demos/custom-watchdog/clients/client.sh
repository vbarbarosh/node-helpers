#!/bin/bash

# http://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin
# http://redsymbol.net/articles/unofficial-bash-strict-mode
set -o nounset -o errexit -o pipefail

script=`realpath $0`
scriptdir=`dirname $script`
scriptname=`basename $script`

BLACK="\e[30m" RED="\e[31m" GREEN="\e[32m" YELLOW="\e[33m" BLUE="\e[34m"
PURPLE="\e[35m" CYAN="\e[36m" WHITE="\e[37m" RESET="\e[0m"

EXIT_MESSAGE="${RED}bin/templ failed${RESET}"

# http://redsymbol.net/articles/bash-exit-traps/
# http://redsymbol.net/articles/unofficial-bash-strict-mode/#essential-cleanup
trap 'echo -e "$EXIT_MESSAGE"' EXIT

while true; do
    if test -S "$WATCHDOG_SOCKET"; then
        # Send empty string and read response
        RESPONSE=$(echo -ne 'ping' | nc -U "$WATCHDOG_SOCKET" 2> /dev/null)
        if [[ "$RESPONSE" == "OK" ]]; then
            echo "[client.sh] $(date '+%F %T') - OK"
        else
            echo "[client.sh] $(date '+%F %T') - FAIL (no OK)"
        fi
    else
        echo "[client.sh] $(date '+%F %T') - FAIL (socket missing)"
    fi
    sleep 1
done

EXIT_MESSAGE="${GREEN}child.sh succeeded${RESET}"
