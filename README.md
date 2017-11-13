# beer-info
Test task about beer searching
## install
For work locally, without production build deploying:
```bash
git clone --recursive https://github.com/beer-info/beer-info.git
cd beer-info
npm i
npm run build-dev
```
If you want to be able to deploy production build, you must also checkout master branch of build submodule repository:
```bash
git -C build/production/client checkout master
```
## working with project
Build development bundle (unoptimized)
```bash
npm run build-dev
```
Run webpack-dev-server
```bash
npm run devserver
```
Build production bundle
```bash
npm run build
```
deploy production bundle
```bash
npm run deploy -- "commit message"
# enter github credentials if needed
```
commit and push project code changes
```bash
npm run push -- "commit message"
# enter github credentials if needed
```
## tests
Tests not implemented yet :(
## view result

Production version published here:

https://beer-info.github.io

By default, local devserver listen on 0.0.0.0:8080, 
so you can use http://localhost:8080 or http://you-vm-domain.com - no matter.

Also, if you want to start devserver in production mode, port will be 8088, but I don`t recomend this, because bundle configured for git pages 

Normally it should works fine and you can do it using this command:
```bash
NODE_ENV=production webpack-dev-server
```
