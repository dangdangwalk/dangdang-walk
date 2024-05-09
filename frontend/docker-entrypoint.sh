#!/bin/sh

if [ -f "./build/env.js" ]; then
    rm "./build/env.js"
fi

echo "window._ENV = {" >> ./build/env.js;

for i in $(env | grep ^REACT_APP_ ); do
  key=$(echo $i | cut -d '=' -f 1)
  value=$(echo $i | cut -d '=' -f 2-)

  echo "$key:'$value'," >> ./build/env.js;
done

echo "}" >> ./build/env.js;

exec serve -s build
