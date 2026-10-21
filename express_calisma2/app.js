const express = require('express');
const app = express();
const port = 3000;

const joi = require("joi");
app.use(express.json()); //Express.js projelerinde sunucuya gelen JSON formatındaki verileri (gövdeleri) okuyabilmeyi sağlayan ara yazılımdır (middleware)

const kullanicilar=[
    {id:1, ad:'emre', soyad:'yilmaz'},
    {id:2, ad:'ahmet', soyad:'demir'},
    {id:3, ad:'ayse', soyad:'kaya'}
];

const kullaniciSchema = joi.object({
    ad: joi.string().min(2).required(),
    soyad: joi.string().min(2).required(),
    yas: joi.number().integer().min(18).max(50).optional()
    //required değilse optionaldir zaten.
    //alphanum her sayı hem harf hem sayı olabilir. 
}); 

app.get('/', (req, res) => {
  console.log("GET request received at /");
    res.send('Hello World!');
});

app.get('/kullanicilar', (req, res) => {
  console.log("GET request received at /kullanicilar");
    res.json(kullanicilar);
});


/******************************************************* */
app.post('/kullanicilarA', (req, res) => {
  console.log("POST request received at /kullanicilarA");
  
  // kontrolü en zayıf olan yöntem.
    const yeniKullanici = req.body;

    kullanicilar.push(yeniKullanici);
    res.status(201).json(yeniKullanici);
});


/******************************************************* */
app.post('/kullanicilarB', (req, res) => {
      console.log("POST request received at /kullanicilarB");

      // id,ad ve soyaddan yakalanabileni alır. diğer alanları almaz.
     const yeniKullanici = {
        id:kullanicilar.length + 1,
        ad:req.body.ad,
        soyad:req.body.soyad
  }
   kullanicilar.push(yeniKullanici);
    res.status(201).json(yeniKullanici);
});



/*********************************************************** */
app.post('/kullanicilarC', (req, res) => {
      console.log("POST request received at /kullanicilarC");

      /*daha güçlü kontrol*/
  const { ad, soyad, yas } = req.body;

  // Eğer 'ad' veya 'soyad' gönderilmediyse hata döndür
  if (!ad || !soyad) {
    return res.status(400).json({ 
      hata: "Eksik bilgi! 'ad' ve 'soyad' alanları zorunludur." 
    });
  }
  if(yas !==undefined && (typeof yas !=='number' || yas < 0)) {
    return res.status(400).json({ 
      hata: "Geçersiz bilgi! 'yas' alanı negatif bir sayı olamaz." 
    });
  }

  const yeniKullanici = {
    id: kullanicilar.length + 1,
    ad: ad,
    soyad: soyad,
    ...(yas !== undefined ? { yas: yas } : {}) // Eğer yas undefined değilse, yas alanını ekle
    //... (Spread Operatörü): süslü parantezin içindeki veriyi açarak ana nesnenin içine (örneğin yeniKullanici nesnesine) yapıştırır.
};
 kullanicilar.push(yeniKullanici);
    res.status(201).json(yeniKullanici);
});



/******************************************************* */
//joi ile kontrol
app.post('/kullanicilarD', (req, res) => {
      console.log("POST request received at /kullanicilarD");

  const { error,value } = kullaniciSchema.validate(req.body);
    if(error){
        return res.status(400).json({ hata: error.details[0].message }); //yakalanan ilk hata kullanıcıya verilsin
    }

const yeniKullanici = {
    id:kullanicilar.length+1,
    ...value //value: value, value nesnesi req.body ile aynı yapıya sahip. yani ad, soyad ve yas alanlarını içeriyor.
};
kullanicilar.push(yeniKullanici);
res.status(201).json(yeniKullanici);
});

app.listen(3000, () => {
  console.log("Sunucu 3000 portunda ayakta!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});