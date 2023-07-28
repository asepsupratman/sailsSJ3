module.exports = {
   datastore : 'sj3',
   tableName: 'order_aws',
   migrate: 'safe',
   attributes: {
       kdbrg   : 'string',
       namabrg : 'string',
       qtn     : 'number',
       harga   : 'number',
       buffer  : 'string',
       kdlgn   : 'string',
       namalgn : 'string',
       
   }
}
