#!/bin/bash
cd "$(dirname "$0")"
declare -A P; i=0; for k in $(node keys.mjs); do P[$k]=$i; i=$((i+1)); done
for n in "$@"; do higgsedit frame . ${P[$n]}.5 --out out/$n.png >/dev/null 2>&1 || echo fail $n; done
