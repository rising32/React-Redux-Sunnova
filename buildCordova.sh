#!/bin/sh -e

npm run build
npm run build-dlls

rm -rf ../SunnovaProCordova/www/dist/main.js ../SunnovaProCordova/www/dist/main.css ../SunnovaProCordova/www/dist/dlls/dll__vendor.js

cp static/dist/main-*.js ../SunnovaProCordova/www/dist/main.js
cp static/dist/main-*.css ../SunnovaProCordova/www/dist/main.css
cp static/dist/dlls/dll__vendor.js ../SunnovaProCordova/www/dist/dlls/dll__vendor.js

# replace url in stylesheet, /images to ../images
perl -pi -w -e 's/\/images/..\/images/g' ../SunnovaProCordova/www/dist/main.css
