#!/bin/bash

# Nastavte proměnné
LOCAL_SRC_DIR="./src/*"
TEMP_DIR="./dist"
REMOTE_DST_DIR="~/public_html"
MESICE=(leden únor březen duben květen červen červenec srpen září říjen listopad prosinec)
MESIC=${MESICE[$(date +%-m)-1]}
DATETIME=$(date +"%d. $MESIC %Y %H:%M")

mkdir -p $TEMP_DIR
cp -r $LOCAL_SRC_DIR $TEMP_DIR

find $TEMP_DIR/* -type f -name "*.html" -exec sed -i "" "s/UPDATE_DATETIME/$DATETIME/g" {} +

ssh akela "rm -rf $REMOTE_DST_DIR/*"

rsync -avz --delete $TEMP_DIR/* akela:$REMOTE_DST_DIR

rm -rf $TEMP_DIR


echo "Kopírování dokončeno!"
