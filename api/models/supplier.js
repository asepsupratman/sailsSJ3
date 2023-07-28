module.exports = {
    datastore : 'sj3',
    tableName: 'supplier',
    migrate: 'safe',
    attributes: {
        id : {columnName : 'kdsupp', type : 'string', required : true},
        //kdsupp : 'string',
        namasupp : 'string',
        alamat : 'string',
        awal : 'number',
        debet: 'number',
    }
}
