module.exports = {
  friendlyName: "VA",
  description: "",
  inputs: {
    jenis: { type: "string", allowNull: true },
    namabrg: { type: "string", allowNull: true },
    limit: { type: "string", allowNull: true },
    skip: { type: "string", allowNull: true },
  },

  // inputs: {
  //   namabrg: { type: 'string',  required: true},
  //   limit: { type: 'number',  required: false},
  //   skip: { type: 'number',  required: false},

  // },
  exits: {
    success: {
      responseType: "okMetaData",
    },
    errorRespon: {
      responseType: `errorRespon`,
    },
  },

  fn: async function (inputs, exits) {
    const res = this.res;
    const req = this.req;

    let namabrg = inputs.namabrg;
    let jenis = inputs.jenis;
    let limit = inputs.limit;
    let skip = inputs.skip;

    let detil;
    let brgGrup, brgDetil;
    let data, kdbrg, grpbrg;
    let cari, syarat
    if (!limit) limit = 1000;
    if (!skip) skip = 0;
    let metadata = {
      limit: limit,
      skip: skip,
    };
    let field = [
      "grpbrg",
      "namagrp",
      "stok",
      "hrgstd",
      "stnstd",
      "stsrec",
      "stok",
      "jenis",
      "sts1",
      "sts2",
      "sts3"
    ];

    try {
      await sails.getDatastore().transaction(async (db) => {
        // START AREA KERJA LOGIK
        /// .find()    => hasilnya Array
        // .findOne() => hasilnya object
        /*
        indo atau indo% => di-awal
        %indo   => di-akhir
        %indo%  => containt
        */

        if (jenis) {
          brgGrup = await VwStokBarang.find({
            where: {
              stsrec: "A",
              jenis,
            },
            select: field,
          })
            .sort("namagrp")
            .limit(limit)
            .skip(skip);
        } else {
          namabrg = namabrg.replace(/%20/g, " ");
          let pj = namabrg.length;
          let pos = namabrg.indexOf("%");
          if (pos < 0) {
            //tidak ada % console.log("di-awal-1 => starWith");
            syarat = "startsWith";
          } else if (namabrg[0] == "%" && namabrg[pj - 1] == "%") {
            //% diawal dan diujung console.log("ditengah2 => contain");
            syarat = "contains";
          } else if (namabrg[pj - 1] == "%") {
            //% diujung console.log("diakhir3 =>startWith");
            syarat = "startsWith";
          } else if (pos == 0) {
            //% diawal console.log("diakhir4 =>endtWith");
            syarat = "endsWith";
          } else if (pos + 1 == pj) {
            //% diujung console.log("diawal5 =>startWith");
            syarat = "startsWith";
          } else {
            //Selain kondisi console.log("ditengah6 => contain");
            syarat = "contains";
          }
          namabrg = namabrg.replace(/%/g, "");
          //let cari = replaceAll(namabrg,'%','')  
          console.log("syarat-106 cari", syarat, namabrg);
          //cari = replaceAll(cari,'%','')  
          //console.log("syarat-106 cari",syarat,cari);

          //namabrg = cari
          brgGrup = await VwStokBarang.find({
            where: {
              stsrec: "A",
              //or: [{ sts1: "A" }, { sts2: "A" }, { sts3: "A" }],
              or: [
                { namagrp: { [syarat]: namabrg } },
                { nama1: { [syarat]: namabrg } },
                { nama2: { [syarat]: namabrg } },
                { nama3: { [syarat]: namabrg } },
              ],
            }, select: field,
          })
            .sort("namagrp")
            .limit(limit)
            .skip(skip);
          ;

        }
        if (!brgGrup || brgGrup.length < 1) throw {
          //tidak ada grup barang => barang tidak ada
          code: 404, message: `Nama Barang tidak ditemukan`
        }
        console.log("detil", brgGrup)
        
        brgGrup = brgGrup.filter(item =>
          item.sts1 === 'A' || item.sts2 === 'A' || item.sts3 === 'A')
        console.log("detil2", brgGrup)
          
        metadata.numrows = brgGrup.length
        let urutan = brgGrup.map((item, index) => {
          return { nomor: index + 1, item }
        })

        //cari detil barang berdasar brgGrup
        grpbrg = brgGrup.map((row) => row.grpbrg);
        detil = await BarangDetil.find({
          where: { grpbrg, sts: 'A' },
        })
          .sort("kdbrg")
          .limit(1000)
        
        let hasil = brgGrup.map((item) => {
          let anakItem = detil.filter(
            (anakItem) => anakItem.grpbrg === item.grpbrg
          );
          return { ...item, detil: anakItem };
        });

        brgGrup = hasil;
        brgGrup.detil = detil;

        /*
        const angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        // Contoh 1: Menggunakan fungsi filter dengan kondisi
        const angkaGanjil = angka.filter((nilai) => nilai % 2 !== 0);
        console.log(angkaGanjil); // Output: [1, 3, 5, 7, 9]
        */

        // END KERJA LOGIK
      });

      let ket = jenis ? `Jenis barang ${jenis}` : `Nama Barang ${namabrg}`;
      let bb = "";
      let aa = bb ? "12" : "13";

      data = brgGrup;
      return exits.success({
        message: `Ditemukan List barang ${metadata.numrows}`,
        data,
        metadata,
      });
    } catch (e) {
      console.log("error Catch", e);
      e = e.raw || e;
      if (!e.code || typeof e.code == "string") {
        return exits.errorRespon(e.message);
      } else {
        res.status(e.code).json(e);
      }
    }
  }

};

/*
                Custom get
        1. Find semua barang yg dicari
        2. Find detil where grpbrg di langkah 1.
          Di langkah 2,
          untuk where grpbrgArray = grpbrgList.map(row => row.grpbrg)
          //let grupBrg = header.map(row => row.grpbrg).join('","')

        3. Looping data 1, inserker data 2 pake array filter
        */

//cari pada tabel barang detil
/*
           .find({
            where: {
              or: [{ namagrp: { startsWith: namabrg } },
              { nama1: { startsWith: namabrg } },
              { nama2: { startsWith: namabrg } },
              { nama3: { startsWith: namabrg } },
              ]
            },
          })
          .sort('namagrp')
        */

/*
------------- Script hitung stok -------------------------
  let sql = `select f.grpbrg , f.namagrp
    ,stok DIV a.isi stok1, a.stn stn1
    ,(stok - (stok DIV a.isi * a.isi)) DIV b.isi stok2, ifnull(b.stn,'') stn2
    ,ifnull(stok
    - (stok DIV a.isi * a.isi)
    - (stok - (stok DIV a.isi * a.isi)) DIV b.isi * b.isi,0) stok3 ,ifnull(c.stn,'') stn3
    ,a.hjual2 hjual1
    ,b.hjual2 hjual2
    ,c.hjual2 hjual3
    ,a.isi isi1
    ,b.isi isi2
    ,c.isi isi3
    ,f.stsrec
    ,f.kdjenis
    ,f.stok
    ,awal DIV a.isi awal1
    ,(awal - (awal DIV a.isi * a.isi)) DIV b.isi awal2
    ,ifnull(awal
      - (awal DIV a.isi * a.isi)
      - (awal - (awal DIV a.isi * a.isi)) DIV b.isi * b.isi,0) awal3
    , masuk DIV a.isi masuk1

    ,(masuk - (masuk DIV a.isi * a.isi)) DIV b.isi masuk2
    ,ifnull(masuk
      - (masuk DIV a.isi * a.isi)
      - (masuk - (masuk DIV a.isi * a.isi)) DIV b.isi * b.isi,0) masuk3

    ,keluar DIV a.isi keluar1
    ,(keluar - (keluar DIV a.isi * a.isi)) DIV b.isi keluar2
    ,ifnull(keluar
      - (keluar DIV a.isi * a.isi)
      - (keluar - (keluar DIV a.isi * a.isi)) DIV b.isi * b.isi,0) keluar3
    , f.stdjual
    ,f.id
    from vw_barang_stok f
      LEFT JOIN barang_detil a on a.kdbrg = CONCAT(f.grpbrg,'1')
      LEFT JOIN barang_detil b on b.kdbrg = CONCAT(f.grpbrg,'2')
      LEFT JOIN barang_detil c on c.kdbrg = CONCAT(f.grpbrg,'3')
    where f.grpbrg= '${inputs.namabrg}' or
      f.namagrp like '${inputs.namabrg}%'
    order by f.namagrp LIMIT 100`
  console.log('NamaGrp:', inputs.namabrg)
  header = await sails.sendNativeQuery(sql).usingConnection(db);





   if (jenis) {
          console.log("parameter jenis", jenis);
          brgGrup = await VwStokBarang.find({
            where: {
              stsrec: "A",
              jenis: jenis,
              or: [{ sts1: "A", sts2: "A", sts3: "A" }],
            },
            select: field
          }).sort("namagrp")
            .limit(limit)
            .skip(skip);
          let q = `SELECT count(*) as jml from barang where jenis='${jenis}' and stsrec = 'A'`;
          console.log("cek jenis-61", q);
          let fetch = await sails.sendNativeQuery(q).usingConnection(db);
          fetch = fetch.recordset[0];
          console.log("cek jenis-63", fetch.jml);
          //await sails.sendNativeQuery(q).usingConnection(db);
          metadata.numrow = fetch.jml;

        } else if (namabrg && isNaN(namabrg)) {
          //parameter NAMA_BARANG
          console.log("parameter namabrg", namabrg);
          brgGrup = await VwStokBarang.find({
            where: {
              stsrec: 'A',
              or: [ { sts1: 'A', sts2: 'A', sts3: 'A' },
                    {jenis : jenis},
                    { namagrp: { startsWith: namabrg }},
                    { nama1: { [syarat]: namabrg }},
                    { nama2: { [syarat]: namabrg}},
                    { nama3: { [syarat]: namabrg}},
                  ]
            }, select: field
          }).sort("namagrp")
            .limit(limit)
            .skip(skip);
          console.log("hasil param namabrg", grpbrg);


        } else {
          //parameter KODE / BARCODE BARANG
          let barcode = namabrg
          console.log("parameter KODE/barcode", namabrg);
          //cari pada barcode
          data = await BarangBarcode.findOne({
            where: { barcode: barcode },
            select: ['id', 'kdbrg']
          })
          if (data) {
            //ada pada tabel baracode
            kdbrg = data.kdbrg
            grpbrg = kdbrg.substring(0, kdbrg.length - 1)
            brgGrup = await VwStokBarang.find({
              where: {
                stsrec: 'A', grpbrg: grpbrg
              }, select: field
            }).sort('namagrp')
              .limit(limit)
              .skip(skip)
          } else {
            //tidak ketemu di tabel barcode
            //cari ditabel barang
            grpbrg = namabrg
            brgGrup = await VwStokBarang.find({
              where: {
                stsrec: 'A', grpbrg: grpbrg
              }, select: field
            }).sort('namagrp')
              .limit(limit)
              .skip(skip)
            if (!brgGrup || brgGrup.length < 1) {
              kdbrg = grpbrg.substring(0, kdbrg.length - 1)
              brgGrup = await barang.find({
                where: {
                  stsrec: 'A', grpbrg: kdbrg
                }, select: field
              }).sort('namagrp')
                .limit(limit)
                .skip(skip)
              //cari di barang detil
            }
          }
        }





  */
