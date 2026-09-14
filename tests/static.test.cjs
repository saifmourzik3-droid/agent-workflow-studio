'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),http=require('node:http');
const {createApp}=require('../server.cjs');
test('static demo cannot expose server files or accept writes',async t=>{
 const app=createApp();await new Promise(r=>app.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>app.close(r)));
 const base='http://127.0.0.1:'+app.address().port;
 assert.equal((await fetch(base+'/')).status,200);
 for(const route of ['/.env','/server.cjs','/package.json','/.git/config','/../README.md'])assert.equal((await fetch(base+route)).status,404);
 assert.equal((await fetch(base+'/',{method:'POST',body:'demo'})).status,405);
 const csp=(await fetch(base+'/')).headers.get('content-security-policy');assert.ok(csp.includes("connect-src 'none'"));assert.ok(!csp.includes('unsafe-eval'));
 const hostStatus=await new Promise((resolve,reject)=>{http.get(base,{headers:{Host:'example.invalid'}},r=>{r.resume();resolve(r.statusCode);}).on('error',reject);});assert.equal(hostStatus,403);
});
