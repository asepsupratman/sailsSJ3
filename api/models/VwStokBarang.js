module.exports = {
  tableName: 'vw_hitung_stok_akhir',
  migrate: 'safe',
  attributes: {
    id: { columnName: 'id', type: 'number', required: true },
    grpbrg: 'string',
    jenis: 'string',
    namagrp: 'string',
    stok: 'number',
    stok1: 'number',
    stok2: 'number',
    stok3: 'number',
    stn1: 'string',
    stn2: 'string',
    stn3: 'string',
    hbeli1: 'number',
    hbeli2: 'number',
    hbeli3: 'number',
    hjual1: 'number',
    hjual2: 'number',
    hjual3: 'number',
    nama1: 'string',
    nama2: 'string',
    nama3: 'string',
    stsrec: 'string',
    sts1: 'string',
    sts2: 'string',
    sts3: 'string',
    hrgstd: 'number',
    stnstd: 'string'

  }
}
