module.exports = {
    datastore : 'sj3',
    tableName: 'lgn',
    migrate: 'safe',
    attributes: {
        id : {columnName : 'kdlgn', type : 'string', required : true},
        panggil : 'string',
        namalgn : 'string',
    }
}
