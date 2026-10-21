
const express = require('express');
const app = express();
const port  = 3000;

const joi = require('joi');

app.use(express.json());

const urun = [
    {
        id:1,
        marka : "x",
        model : "y"
    },
    {
        id:2,
        marka : "a",
        model : "b"
    },
    {
        id:3,
        marka : "c",
        model : "d"
    }
];

    const urunSchema = joi.object({
        marka : joi.string().min(3).required(),
        model: joi.string().min(3).required()
    });

app.get('/listele',(req,res)=>{
    console.log('Listeleme işlemi yapılıyor...');
    res.json(urun);
});

app.post('/ekle',(req,res)=>{
    const { error, value} = urunSchema.validate(req.body);
    if(error){
        console.log('Hata oluştu.');
        return res.status(400).send(error.details[0].message);
    }

    const yeniUrun = {
        id: urun.length + 1,
        ...value
    };

    urun.push(yeniUrun);
    console.log('Yeni ürün eklendi.');
    res.status(201).json(yeniUrun);

});

app.put('/guncelle/:id',(req,res)=>{

    const id = parseInt(req.params.id);//URL'den gelen ID'yi yakalıyoruz
    const urunIndex = urun.findIndex(k=> k.id === id);//ID'ye göre kullanıcıyı buluyoruz
    if(urunIndex === -1){
        console.log('Kullanıcı bulunamadı.');
        return res.status(404).send('Kullanıcı bulunamadı.');
    }

    const { error, value} = urunSchema.validate(req.body);
    if(error){
        console.log('Hata oluştu.');
        return res.status(400).send(error.details[0].message);
    }

    urun[urunIndex]={
        id: urun[urunIndex].id,
        ...value
    };
    
    res.status(200).json(urun[urunIndex]);
    console.log('Ürün güncellendi.');
});


app.delete('/sil/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const bulunanUrun = urun.find(k=> k.id === id);
    if(!bulunanUrun){
        console.log('Ürün bulunamadı.');
        return res.status(404).send(req.params.id + ' idli ürün bulunamadı.');
    } 
    else{
        /*Belirtilen elemanın dizide kaç numaralı indekste (sırada) olduğunu arar 
        ve bulduğu ilk eşleşmenin indeks numarasını (0'dan başlayan sırasını) geri döndürür. 
        Eğer aranan eleman dizide bulunamazsa -1 değerini döndürür. */
        const index = urun.indexOf(bulunanUrun);
        //dizi.splice(baslangicIndeksi, silinecekElemanSayisi, eklenecekEleman1, eklenecekEleman2, ...);
        urun.splice(index,1); //index nodan başla 1 adet sil
        console.log('Ürün silindi.');
        res.status(200).send('Ürün silindi.');
    }
});



//app.listen(port, [host], [backlog], [callback])
//app.listen(3000, '127.0.0.1', ...) yazarsan sunucu sadece kendi bilgisayarından (localhost) gelen istekleri dinler.
//app.listen(3000, '0.0.0.0', ...) yazarsan, aynı ağdaki diğer cihazların senin bilgisayarının IP adresi üzerinden bu sunucuya erişmesine izin vermiş olursun

app.listen(port,()=>{
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});