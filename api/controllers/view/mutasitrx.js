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
         /// START AREA KERJA LOGIK
         //User.findOne User=>nama model (tanpa .js)
         //.findOne => methode bawaa sails
 
         const USER = await User.findOne(userFromToken.id).usingConnection(db);
         imagePhoto = (await UploadServices.base64toImage(inputs.imageBase64, 'publicfolder', `img_${USER.id}_` + moment().valueOf())).filename
         let data = { imagePhoto }
 
         let updatePhoto = await User.update(USER.id).set({ ...data }).fetch().usingConnection(db);
         CompareObject("line 28", data, updatePhoto[0])
 
         ////DELETE image lama
         await UploadServices.unlink('publicfolder/' + USER.imagePhoto);
 
         ///query nativ
         let q = "update tbl_user set photo='photo.jpeg' where id=1";
         await sails.sendNativeQuery(q).usingConnection(db);
 
          /// END KERJA LOGIK
 
       })
       return exits.success({imagePhoto});
     } catch (e) {
       Log.error("line 23", e)
       e = e.raw || e
       if (!e.code || typeof e.code == 'string') {
         return exits.errorRespon(e.message);
       } else {
         res.status(e.code).json(e)
       }
     }
 
   }
 
 
 };