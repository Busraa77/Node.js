const express = require('express');
const app = express();// Yeni bir Express uygulaması nesnesi oluşturduk


const kullanicilar = [
  { id: 1, ad: 'Emre', soyad: 'Kaya' },
  { id: 2, ad: 'Hasan', soyad: 'Kaya' },
  { id: 3, ad: 'Ali', soyad: 'Kaya' }
];


/*Bir kullanıcı siteye ana dizinden ('/') bir GET isteği yaparsa, parantez içindeki fonksiyonu çalıştırır." */
app.get('/', (req, res) => {
  res.send('Hello, World!'); //akıllıdır. content-type vs kendi belirliyo write ve endi birlestiriyo.
});

app.get('/about', (req, res) => {
  res.send('This is the about page.');
});
/*req.query, URL'in sonundaki soru işaretinden (?) sonra gelen parametreleri yakalar.*/
app.get('/users', (req, res) => {
  console.log(req.query); // URL'deki query parametrelerini alır
  if(req.query.ad && req.query.soyad) { //Kullanıcının URL'de hem ad hem de soyad parametrelerini gönderip göndermediğini kontrol eder
    const ad = req.query.ad.toLowerCase(); //Gelen bu bilgileri yerel değişkenlere kayder.
    const soyad = req.query.soyad.toLowerCase();;
    const kullanici = kullanicilar.find(k => k.ad.toLowerCase() === ad && k.soyad.toLowerCase() === soyad); 
    res.send(kullanici ? kullanici.id : 'Kullanıcı bulunamadı.'); 
  }});

  //cevir?ters=true
app.get('/cevir', (req, res) => {
    if(req.query.ters){
      const tersListe = [...kullanicilar].reverse();
      return res.send(tersListe);
    }
    else{
      res.send(kullanicilar);
    }
  });

app.get('/contact', (req, res) => {
  res.send([{ad:'emre',soyad:'kaya'},{ad:'hasan',soyad:'kaya'}]);
});

app.get('/kullanicilar/:id', (req, res) => {
  console.log(req.params.id); // URL'deki id parametresini alır
  const id = parseInt(req.params.id);//stringi integera çevirir
  const kullanici = kullanicilar.find(k => k.id === id);
  if (!kullanici) {
    return res.status(404).send(req.params.id + ' numaralı kullanıcı bulunamadı.');
  }
  //  res.send(kullanici); //esnek metod
  res.json(kullanici); //Eğer kullanıcı başarıyla bulunduysa, bulduğu kullanıcı bilgisini otomatik olarak JSON formatına çevirip tarayıcıya (veya istek atan uygulamaya) geri gönderir.
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});