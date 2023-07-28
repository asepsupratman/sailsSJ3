//const BarangDetil = require("../models/BarangDetil");
//const OrderAws = require("../models/OrderAws");

module.exports = {
  friendlyName: 'VA',
  description: '',
  inputs: {
    order: { //nama parameter
      type: 'ref', //ref:Array/object 
      description: 'The current incoming request (req).',
      required: true
    }
  },
  exits: {
    success: {
      responseType: 'ok'
    },
    errorRespon: {
      responseType: `errorRespon`
    }
  },

  fn: async function (inputs, exits) {
    const res = this.res;
    const req = this.req;
    let buffer
    try {

      let params = { dataStore: 'sj3', buffer: '1' }
      let newBuffer = await sails.helpers.newBuffer.with(params)

      await sails.getDatastore("sj3").transaction(async db => {
        /// START AREA KERJA LOGIK
        //User.findOne User=>nama model (tanpa .js)
        //.findOne => methode bawaa sails
        //hapus buffer dulu

        buffer = newBuffer //"L" + inputs.order[0].kdlgn
        let deviceID = inputs.order[0].deviceID
        if (!deviceID || deviceID === null || deviceID === "") deviceID = "HP"
        sails.log("Buffer:", buffer)
        let nomor = 1
        for (let row of inputs.order) {
          //object = namaField tabel => OrderAws.create(row).usingConnection(db);
          //Object Tidak Sama dgn Field
          let cekbrg = await BarangDetil.findOne({ kdbrg: row.kdbrg }).usingConnection(db)
          if (cekbrg) {
            row.buffer  = buffer
            row.nomor   = nomor
            row.grpbrg  = cekbrg.grpbrg
            row.namabrg = cekbrg.namabrg
            row.stn     = cekbrg.stn
            row.harga   = cekbrg.hjual2
            row.subtotal = row.qtn * row.harga
            row.hpp     = cekbrg.hpp
            row.diskon  = 0
            row.jenis   = cekbrg.jenis
            row.konv    = cekbrg.isi
            row.deviceID = deviceID

            //insert buffer jual  
            await TempJual.create(row).usingConnection(db)
            //await OrderAws.create(row).fetch().usingConnection(db) //field hasil insert diretur
            nomor = nomor + 1
          }
        }
        //END KERJA LOGIK

      })

      return exits.success({ buffer, 
        message :`Order Belanja Sukses\nKode Buffer: ${buffer}`
        
      });
    
      } catch (e) {
      console.error("line 23", e)
      e = e.raw || e
      if (!e.code || typeof e.code == 'string') {
        return exits.errorRespon(e.message);
      } else {
        res.status(e.code).json(e)
      }
    }

  }


};