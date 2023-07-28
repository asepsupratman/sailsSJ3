module.exports = {
    datastore : 'jembar1',
    tableName: 'ao',
    migrate: 'safe',
    attributes: {
        id : {columnName : 'kdao', type : 'string', required : true},
        nmao : 'string',
        nminit : 'string',
    }
}
