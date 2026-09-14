'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.join(__dirname,'dist');
function createApp(){return http.createServer((req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; media-src blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
 try{const host=new URL('http://'+req.headers.host).hostname;if(!['localhost','127.0.0.1'].includes(host)){res.writeHead(403);return res.end();}}catch{res.writeHead(403);return res.end();}
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
 if(name==='/')name='/index.html';
 const target=path.resolve(ROOT,'.'+name),ext=path.extname(target);
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
 if(!target.startsWith(ROOT+path.sep)||!types[ext]||name.includes('..')||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);return res.end();}
 res.writeHead(200,{'Content-Type':types[ext]});res.end(req.method==='HEAD'?undefined:fs.readFileSync(target));
});}
module.exports={createApp};
if(require.main===module)createApp().listen(4320,'127.0.0.1',()=>console.log('Local portfolio demo: http://127.0.0.1:4320'));
