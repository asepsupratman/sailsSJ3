//kebutuhan variable untuk custom..

module.exports.aksimaya = {
    includeNumrows: true,
     FTPConfig : {
	  connection:{
	  //host: (process.env.NODE_ENV == 'development') ?  '202.137.3.196':  '202.137.3.197' ,
	  //host: (process.env.NODE_ENV == 'development') ?  '202.137.3.196':  '119.252.166.221' , //ganti server
	  host: (process.env.NODE_ENV == 'development') ?  '103.111.28.6':  '119.252.166.221' , //ganti server
	  user: "vendor", // defaults to "anonymous"
	  pass: (process.env.NODE_ENV == 'development') ?  "jangkrik.1" : 'assarent' ,  // "assarent" // defaults to "@anonymous"
	  },
	  path : '/ST/Download/',
	  env: process.env.NODE_ENV
	}
}