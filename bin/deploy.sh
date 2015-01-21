#!/bin/bash

echo "Pushing master branch to gh-pages to update live website"
git checkout gh-pages
git merge master
git push
git checkout master
