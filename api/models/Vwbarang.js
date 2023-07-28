module.exports = {
   datastore : 'sj3',
   tableName: 'vw_barang',
   migrate: 'safe',
   attributes: {
       id : {columnName : 'id', type : 'number', required : true},
       grpbrg : 'string',
       namagrp : 'string',
       stok: 'number',
   }
}
