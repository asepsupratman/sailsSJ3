var moment = require('moment');
var axios = require('axios');
module.exports = async (uid_sekolah, portWa, sekolah) => {
  try {
    if (_.has(sails.config.globals.runningSendWa, 'sendingWa_' + uid_sekolah)) {
      if (sails.config.globals.runningSendWa['sendingWa_' + uid_sekolah]) return 'Sedang Proses Pengiriman';
    }
    sails.config.globals.runningSendWa['sendingWa_' + uid_sekolah] = true;
    let randomTimeData = [];

    async function sleep(detik) {
      return new Promise(resolve => setTimeout(resolve, detik * 1000));
    }
    async function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    }
    async function timeRandom() {
      let interval = 5 * 1 + (await getRandomInt(5)) * 1;
      if (randomTimeData.indexOf(interval) > 0) {
        return await timeRandom();
      } else {
        if (_.size(randomTimeData) >= 5) randomTimeData.shift();
        randomTimeData.push(interval);
        return interval;
      }
    }

    let dateFormat = 'YYYY-MM-DD HH:mm:ss';
    let DB = require('../controllers/defineMyModel');
    let dbAktif = await DB.pilihModel(DB, null, uid_sekolah);



    let where = {
      //nomorTujuan: ['085781822216', '08551437600', '085710719545'],
      sendStatus: 0,
      uid_sekolah: uid_sekolah
    };
    let q = `select * from sms_gateway.wa_outbox where ${Fn.decodeWhere({ where: where })}`;
    let fetch = (await sails.getDatastore(dbAktif.dbname).sendNativeQuery(q, []).catch(e => { throw e })).rows;

    let i = 1;
    for (let row of fetch) {
      let timeInterval = await timeRandom();
      if (i % 25 == 0) {
        await axios.post(`http://localhost:${portWa}/send`, { nomor: '085720000976', message: '#menu meseg ke-'+i });
        await sleep(3);
        await axios.post(`http://localhost:1345/send`, { nomor: sekolah.whatsappNumber, message: 'tek tok yu..' });
        await sleep(1);
        await axios.post(`http://localhost:${portWa}/send`, { nomor: '085720000976', message: 'hayu ke-'+i });
        
      }
      console.log("sendWaTo", moment().format(dateFormat), row.nomorTujuan);
      //row.message += `\n\n  Pesan ini otomatis dari system : ${moment().valueOf()}`;
      //let send = {data : {timestamp : true}};
      let send = await axios.post(`http://localhost:${portWa}/send`, { nomor: row.nomorTujuan, message: row.message });
      //console.log(send.data)
      if (_.has(send.data, 'timestamp')) {
        q = `update sms_gateway.wa_outbox set sendStatus=1,sendStatusDate='${moment().format(dateFormat)}' where id=${row.id}`;
        console.log(moment().format(dateFormat), 'next run :', timeInterval)
        await sails.getDatastore(dbAktif.dbname).sendNativeQuery(q, [])
      }
      i++;
      await sleep(timeInterval);
    }

    sails.config.globals.runningSendWa['sendingWa_' + uid_sekolah] = false;
  } catch (e) {
    sails.config.globals.runningSendWa['sendingWa_' + uid_sekolah] = false;
  }
}