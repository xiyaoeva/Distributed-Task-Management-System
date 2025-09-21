
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req,res)=>{
  const p = req.url === '/' ? '/index.html' : req.url;
  const file = path.join(__dirname, p);
  if(fs.existsSync(file)){
    const ext = path.extname(file);
    const type = ext === '.html' ? 'text/html' : 'text/javascript';
    res.writeHead(200, {'Content-Type': type});
    res.end(fs.readFileSync(file));
  }else{
    res.writeHead(404); res.end('Not found');
  }
}).listen(3000, ()=> console.log('Frontend on http://localhost:3000'));
