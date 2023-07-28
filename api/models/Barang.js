module.exports = {
  tableName: 'barang',
  migrate: 'safe',
  attributes: {
    //id: {columnName : 'id', type : 'number', required : true},
    grpbrg: 'string',
    namagrp: 'string',
    stdjual: 'string',
    jenis: 'string',
    kdsupp: 'string',
    awal: 'number',
    masuk: 'number',
    keluar: 'number',
    akhir: 'number',
    hpp: 'number',
    stsrec: 'string',
    kdbrgsupp: 'string',
    lokasi: 'string',
    stdjual: 'string',
  
  }
}
