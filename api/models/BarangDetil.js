module.exports = {
  //tambahan dari local
  tableName: 'barang_detil',
  migrate: 'safe',
  attributes: {
    updatedAt: false,
    id: { columnName: 'id', type: 'number', required: true },
    grpbrg: 'string',
    kdbrg: 'string',
    namabrg: 'string',
    stn: 'string',
    hjual1: 'number',
    hjual2: 'number',
    hjual3: 'number',
    hpp: 'number',
    hbeli: 'number',
    jenis: 'string',
    isi: 'number',
    sts: 'string',
    tglharga: { type: 'string', 'allowNull': true },
    barcode: 'string',

  }
}
