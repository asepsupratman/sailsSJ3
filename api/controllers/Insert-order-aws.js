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
         await sails.getDatastore().transaction(async db => {
            /// START AREA KERJA LOGIK
            //User.findOne User=>nama model (tanpa .js)
            //.findOne => methode bawaa sails

            //insert tabel order_aws (

            for (let row of inputs.order) {
               //object = namaField tabel => OrderAws.create(row).usingConnection(db);
               //Object Tidak Sama dgn Field
               row.namabrg = (await BarangDetil.findOne({ id: row.kdbrg }).usingConnection(db)).namabrg
               //insert
               await OrderAws.create(row).usingConnection(db)
               await OrderAws.create(row).fecth().usingConnection(db) //field hasil insert diretur

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