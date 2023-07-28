module.exports = {
   datastore: 'sj3',
   tableName: 'temp_semjual',
   migrate: 'safe',
   attributes: {
      updatedAt: false,
      buffer: 'string',
      grpbrg: 'string',
      nomor: 'number',
      kdbrg: {type:'string', required:true},
      namabrg: 'string',
      qtn: 'number',
      stn: 'string',
      harga: 'number',
      subtotal: 'number',
      konv: 'number',
      hpp: 'number',
      jenis: 'string',
      kdlgn: 'string',
      panggil: 'string',
      namalgn: 'string',
      alamat: 'string',    
      deviceID: 'string',    

   }
}
