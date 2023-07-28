module.exports = {
  tableName: 'barang_barcode',
  migrate: 'safe',
  attributes: {
      id : {columnName : 'id', type : 'number', required : true},
      barcode   : 'string',
      nama_brg  : 'string',
      kdbrg     : {type:'string', 'allowNull':true},   
      tglinp    : {type:'string', 'allowNull':true},
      updatedAt : {type:'string', 'allowNull':true},     
  }
}
