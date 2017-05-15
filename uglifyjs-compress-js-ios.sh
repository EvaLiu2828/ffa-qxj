#!/bin/sh
echo "Beginning...";
home=$(eval pwd);
echo $home;
dir=${home}/platforms/ios/www/;
echo $dir;
for file in `find $dir -type f -name "*.js"`
do
echo $file;
uglifyjs $file  -m -o $file
done
echo ‘compress JS=====>compress done!’