module.exports = {
    friendlyName: 'Get Number Increment',
    description: 'Digunakan untuk penomoran increment',
    inputs: {        
        kategori: { type: 'string', required: true },
        objectId: { type: 'number', required: true },
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
    	var moment = require('moment');
    	var pad  = require('zpad').amount(6).character('0');
    	var checkExist = await NumberIncrement.findOne({tahun:moment().format('YYYY'), kategori:inputs.kategori, objectId:inputs.objectId});
    	if(checkExist){
    		var obj  =  checkExist;
    	} else {
    		var obj  = await NumberIncrement.create({tahun:moment().format('YYYY'), kategori:inputs.kategori, objectId:inputs.objectId}).fetch();
    	}
        var stringObject =  inputs.kategori +'/'+ moment().format('YYYY') +'/'+ pad(obj.id);
        return exits.success(stringObject);
    }

};