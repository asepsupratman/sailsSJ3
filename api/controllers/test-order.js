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
      try {
         await sails.getDatastore("sj3").transaction(async db => {
            /// START AREA KERJA LOGIK
            //User.findOne User=>nama model (tanpa .js)
            //.findOne => methode bawaa sails

            //insert tabel order_aws (

            for (let row of inputs.order) {
               //object = namaField tabel => OrderAws.create(row).usingConnection(db);
               //Object Tidak Sama dgn Field
               let cekbrg = await BarangDetil.findOne({ kdbrg: row.kdbrg }).usingConnection(db)
               if (!cekbrg) throw {
                  code:404, "message":"Data Brg tidak ada"
               }
               row.namabrg = cekbrg.namabrg
               //insert tabel
               await OrderAws.create(row).usingConnection(db)
               //await OrderAws.create(row).fetch().usingConnection(db) //field hasil insert diretur

            }

            //END KERJA LOGIK

         })
         return exits.success(inputs);
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