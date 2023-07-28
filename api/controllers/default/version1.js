module.exports = {
  friendlyName: 'VA',
  description: '',
  inputs: {
    req: {
      type: 'ref',
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
        // START AREA KERJA LOGIK
        // .find()    => hasilnya Array
        // .findOne() => hasilnya object
        console.log("naparameter ", inputs)
        // END KERJA LOGIK

      })
      return exits.success({
        'message': 'Data sukses'
      });
    } catch (e) {
      Log.error("error Catch", e)
      e = e.raw || e
      if (!e.code || typeof e.code == 'string') {
        return exits.errorRespon(e.message);
      } else {
        res.status(e.code).json(e)
      }
    }

  }


};