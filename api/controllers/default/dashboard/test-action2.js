module.exports = {

  friendlyName: 'Welcome user',

  description: 'Look up the specified user and welcome them, or redirect to a signup page if no user was found.',

  inputs: {
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    unauthorized: {
      description: 'Tidak ada akses ke action ini',
      responseType: 'unauthorized'
    }
  },

  fn: async function (inputs, exits) {
    // Display the welcome view.
    //console.log(this.req.me);
    

    //sails.log(sails.getActions());

    //await Organization.removeFromCollection(inputs.orgId, 'adminUsers', inputs.targetUserId);
   // await Organization.addToCollection(inputs.orgId, 'regularUsers', inputs.targetUserId);

    return exits.success({access:'OK'});
  }
};