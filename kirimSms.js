const axios = require('axios');
//update dari local
let redaksi = "Salam.Dari BANK AMANAH, pengambilan zakat pd Kamis-Jumat, 21-22 April 2022 pkl 09 s.d. 14 di Lt. 2. BAWA STEMPEL dan BERMASKER.Tunjukan SMS ini kepetugas zakat";
let nohp = '085781822216';
let dataNomorHP = [];
dataNomorHP = ['081110935558','08121100362','081211548992','081211706921','081212504658','081212504658','081212504658','081218518051','08121872715','081219102320','081219102320','08121923054','081224171491','081232325932','081280514167','081284780351','081287543927','081287750937','081287750937','081287791626','081290162996','08129042566','08129042566','081290845550','081290894553','081291704597','081291704597','081292845473','081294651816','081295170218','081310156050','081310897869','081311525768','081311879636','081311961768','081315537744','081319017192','081319342610','081319492382','081319520838','081319838766','081319929007','081380418410','081380800264','081381920108','081383628602','081383628602','081383628602','081384678246','081385034355','081386142637','081386899783','081388757760','081388937504','081389615393','081389897166','081389897166','081395093426','081398422827','081410941420','08179000631','081806480220','081808153534','082110050902','082110050902','082111159321','082111541662','082111541662','082113895433','082118353343','082122598823','082124272212','082124857220','082125164885','08219669250','082210935558','082213296790','082213410890','082298380903','083100225256','083191925000','0859514462899','085960661844','087711157244','087780414374','087888363326','088213044754','088290914176','088291892722','088809143196','08881659025','088816659025','08881669025','088905636833','0892391958872','089501889539','089514465894','089516143448','089516162265','089517306343','089518124461','089527233829','0895322119514','0895323285430','089534908683','0895351019988','0895364732465','0895622137740','089605691222','089617322401','089695412207','089695412207','08985596714','08989420393','08997446673','08997561140'];
//dataNomorHP.push(nohp)
//redaksi = 'tes';
async function loopingSMS(){
    let i = 1;
    for(let nohp of dataNomorHP){
        console.log("no",i,nohp)
        if(i < 0){
            i++
            continue;
        }else{
            let url = `http://192.88.0.178:8888/?nohp=${nohp}&pesan=${redaksi}`;
            let status = await axios.get(url)
            console.log(status.data);
            await sleep(10000)
        }
        i++
       
    }
}
async function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

loopingSMS();

// axios.get(url).then((res) => {
//     console.log(nohp,res.data);
// }).catch(e => {throw e});