const http = require('node:http'); //http sunucusu

const hostname = '127.0.0.1'; //localhost
const port = 3000; //sektör standard port numarası

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html'); //res.setHeader() ile sunucuya başlık ekleme işlemi yapılır.
  
  if(req.url === '/') {
    res.write("<h1>Node.js Sunucusu</h1>"); 

  res.end('Hello, World!\n');}
  
  if(req.url === '/about') {
    res.end('<h1>About Page</h1>'); 
  }

  /*process.exit(), Node.js programını (çalışan sunucuyu veya betiği) anında ve zorla durduran bir komuttur.*/
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
