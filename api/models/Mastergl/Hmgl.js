module.exports = {
    datastore: 'sj3',
    tableName: 'h_mastergl',
    migrate: 'safe',
    attributes: {
        coano: 'string',
        tgltrn : 'string',
        awal : 'number',
        akhir : 'number',
        debet : 'number',
        kredit : 'number'
    }
}
