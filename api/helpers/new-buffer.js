module.exports = {
  friendlyName: 'Get buffer Increment',
  description: 'Digunakan untuk mencari buffer kosong',
  inputs: {
    dataStore: { type: 'string', required: true },
    buffer: { type: 'string', required: true },

  },
  exits: {
    success: {
      outputFriendlyName: 'Rights',
      outputDescription: `A user's "rights" within an org.`,
      outputType: ['string']
    },
    orgNotFound: {
      description: 'No such organization exists.'
    }
  },

  fn: async function (inputs, exits) {
    let buffer = inputs.buffer;
    let dataStore = inputs.dataStore;
    
    try {
      async function cekNomor(buffer) {
        let sql = `select buffer from temp_semjual where buffer = 'OL${buffer}'`;
        let fetch = await sails.getDatastore(dataStore).sendNativeQuery(sql) //-> {meta : , rows : []}
        console.log('hasil fetch:', fetch)
        
        let data = fetch.recordset;
        if (data.length == 0) return 'OL'+buffer
        return cekNomor(buffer * 1 + 1)
      }
      let newBuffer = cekNomor(buffer)    
      exits.success(newBuffer);
      
    } catch (e) {
      throw e
    }
  }

};