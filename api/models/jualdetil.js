module.exports = {
  datastore: 'sj3',
  tableName: 'jual_detil',
  migrate: 'safe',
  attributes: {
    id: { columnName: 'jenis', type: 'number', required: true },
    jual: {
      columnName: 'no_nota',
      model: 'jual',
    },
    nomor: 'string',
    kdbrg: 'string',
    namabrg: 'string',
    stn: 'string',
    qtn: 'number',
    subtotal: 'number',
    diskon: 'number',
    hpp: 'number',
    konv: 'number'
  }
}
