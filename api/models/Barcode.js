module.exports = {
    datastore : 'sj3',
    tableName: 'barang_barcode',
    migrate: 'safe',
    attributes: {
        id : {columnName : 'id', type : 'number', required : true},
        barcode : 'string',
        nama_brg : 'string',
        tglinp : 'string',
        kdbrg :{
            model : "BarangDetil",
            columnName : "kdbrg",
            
        }
            
    }
}
