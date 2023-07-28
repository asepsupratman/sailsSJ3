module.exports = {
  friendlyName: 'VA',
  description: '',
  inputs: {
    // order: { //nama parameter
    //   type: 'ref', //ref:Array/object 
    //   description: 'The current incoming request (req).',
    //   required: true
    // }
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
    let params = {dataStore:'sj3des', buffer:'1'}
    try {
      let newBuffer = await sails.helpers.newBuffer.with(params)

      return exits.success({ newBuffer });
    } catch (e) {
      console.log("line 23", e)
      e = e.raw || e
      if (!e.code || typeof e.code == 'string') {
        return exits.errorRespon(e.message);
      } else {
        res.status(e.code).json(e)
      }
    }

  }
};