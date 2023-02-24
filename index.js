import { create } from 'ipfs-http-client'
import fs from 'fs';
import express from 'express';
import path from 'path';

var codes = JSON.parse(fs.readFileSync('./data.json'));
console.log(codes);
const app = express();
const PORT = 8080;
const client = create();

app.get('/',function(req,res) {
    res.sendFile(path.resolve()+"\\index.html");
    console.log(path.resolve()+"\\index.html");
  });

app.get('/decoded/:code',addCode);

function  addCode(request,response) {
    var data = request.params;
    var code = data.code;
    var fileData = codes; 
    var keys = Object.keys(fileData);
    console.log(fileData);
    if (code in fileData){
            var value= fileData[code];
            fileData[code] = value+1;
        }
        else {
            fileData[code] = 1 ;
        }
    fs.writeFile('./data.json',JSON.stringify(fileData),finished);
    fs.writeFile('./data.txt',JSON.stringify(fileData),finished);
    ipfsAdd();
    console.log(fileData);
    ipfsGet();
}

async function ipfsAdd() {
    console.log('IPFS ADD function');
    const { cid } = await client.add('./data.txt');
    // console.log(cid.toString());
    fs.writeFile('./hash.txt',cid.toString(),finished);
}

async function ipfsGet() {
    console.log('IPFS GET function');
    var cid = fs.readFileSync('./hash.txt','utf8');
    console.log(cid.trim())
    const resp = await client.cat(cid.trim());
    let content = [];
    for await (const chunk of resp) {
        content = [...content, ...chunk];
    }
    console.log(content );
}

function finished(err){
    // console.log("done");
}

app.listen(PORT);
console.log('Running at Port '+PORT);