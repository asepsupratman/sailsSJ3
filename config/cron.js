module.exports.cron = {
  closing: {
    schedule: '*/5 * * * * *',
    onTick: async function () {
      //code here
    },
    onComplete: function () {
      console.log('I am triggering when job is complete');
    },
  },
};