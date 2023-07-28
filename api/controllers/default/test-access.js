module.exports = {
  friendlyName: 'Action allow',
  description: 'Test action yg di allow',
  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
    }
  },
  exits: {
    success: {
      responseType: 'ok'
    },
    customRespon: {
      description: `Bebas deskripsi`,
      responseType: `notFound`
    }
  },


  fn: async function (inputs, exits) {

    return exits.success();

  }


};