module.exports = {
    datastore : 'sj3',
    tableName: 'vw_jual_detil',
    migrate: 'safe',
    attributes: {
	id : {columnName : 'id', type : 'number', required : true},
        namabrg : 'string'
    }
}
