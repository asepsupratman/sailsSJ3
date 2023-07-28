module.exports = {
  friendlyName: "VA",
  description: "",
  inputs: {
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
    let limit = inputs.limit;
    let skip = inputs.skip;

    let detil;
    let brgGrup, brgDetil;
    let data, kdbrg, grpbrg;
    namabrg = namabrg.replace(/%20/g, ' ')
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
    ];
    try {
      await sails.getDatastore().transaction(async (db) => {
        // START AREA KERJA LOGIK
        /// .find()    => hasilnya Array
        // .findOne() => hasilnya object
        let filterLike = ''
        let pj = namabrg.length
        let persen = namabrg.indexOf('%')
        //console.log(nama[0], nama[pj -1])        
        let q = `select grpbrg 
            from vw_hitung_stok_akhir
            where stsrec='A'
            and (sts1='A' or sts2='A' or sts3='A') 
            and ( grpbrg = '${namabrg}' 
              or kdbrg1 = '${namabrg}' 
              or kdbrg2 = '${namabrg}'
              or kdbrg3 = '${namabrg}'
              or nama1 like '${namabrg}'
              or nama2 like '${namabrg}'
              or nama3 like '${namabrg}'
              or grpbrg in (
                select left(kdbrg,len(kdbrg) -1) grpbrg 
                from barang_barcode 
                where barcode = '${namabrg}'
              )
              or jenis = '${namabrg}'
            )`
        console.log("query", q)
        brgGrup = await sails.sendNativeQuery(q).usingConnection(db)
        console.log("hasil brgGrup1", brgGrup)
        //tidak ada grup barang => barang tidak ada
        if (!brgGrup || brgGrup.length < 1) throw {
          code: 404, message: `Nama Barang tidak ditemukan`
        }
        metadata.numrows = brgGrup.rowsAffected[0]
        brgGrup = brgGrup.recordset
        console.log("hasil brgGrup2", brgGrup)

        let mapGrup = brgGrup.map((row) => row.grpbrg)

        //console.log("hasil query", grpbrg.recordset)
        console.log("hasil query grpbrg", brgGrup)
        console.log("hasil map mapGrup", mapGrup)

        //console.log("hasil query effected", grpbrg.rowsAffected[0])

        brgGrup = await VwStokBarang.find({
          where: {
            grpbrg: ['1935','2129'], //stsrec: "A",
            or: [{ sts1: "A", sts2: "A", sts3: "A" }],
          },
          select: field
        }).sort("namagrp")
          .limit(limit)
          .skip(skip);
        console.log("hasil-108 brgGrup", brgGrup)

        // console.log("hasil bgGrup", brgGrup);
        // detil = await BarangDetil.find({
        //   where: { grpbrg:mapGrup },
        // }).sort("kdbrg");

        // let hasil = brgGrup.map((item) => {
        //   let anakItem = detil.filter(
        //     (anakItem) => anakItem.grpbrg === item.grpbrg
        //   );
        //   return { ...item, detil: anakItem };
        // });
        // console.log("brgDetil-126", hasil);

        // //detil = brgDetil
        // brgGrup = hasil;
        // brgGrup.detil = detil;

        // END KERJA LOGIK
      });

      data = brgGrup;
      return exits.success({
        //message: `Ditemukan List ${namabrg}, ${detil.length} data`,
        data,
        metadata,
      });
      //return exits.success(
      //  data
      //);
    } catch (e) {
      console.log("error Catch", e);
      e = e.raw || e;
      if (!e.code || typeof e.code == "string") {
        return exits.errorRespon(e.message);
      } else {
        res.status(e.code).json(e);
      }
    }
  },
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
*/
