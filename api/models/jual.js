module.exports = {
  datastore: 'sj3',
  tableName: 'jual',
  migrate: 'safe',
  attributes: {
    id: { columnName: 'no_nota', type: 'number', required: true },
    kdlgn: 'string',
    namalgn: 'string',
    tgltrn: 'string',
    nominal: 'number',
    hpp: 'number',
    jual_detil: {
      collection: 'jualDetil',
      via: 'jual'
    }
  }
}
