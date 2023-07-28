module.exports = {
  //datastore: 'giat_mart',
  tableName: 'vw_barcode_stok',
  migrate: 'safe',
  attributes: {
      id: { columnName: 'id', type: 'number', required: true },
      kdbrg: 'string',
      namabrg: 'string',
      namagrp: 'string',
      stn: 'string',
      isi: 'number',
      stokg : 'number',
      hpp: 'number',
      hbeli: 'number',
      grpbrg:'string',
      hjual1: 'number',
      hjual2: 'number',
      hjual3: 'number',
      barcode: 'string',
      jenis: 'string',
      levelhrg: 'string',

  }
}
