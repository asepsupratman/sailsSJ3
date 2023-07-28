module.exports = {
    datastore: 'sj3',
    tableName: 'vw_aws_trx',
    migrate: 'safe',
    attributes: {
        tgltrn: 'string',
        ket: 'string',
        nominal : 'number',
        
    }
}
