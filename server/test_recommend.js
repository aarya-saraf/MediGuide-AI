const doctorService = require('./services/doctorService');

(async () => {
  try {
    const rec = await doctorService.recommendDoctors(5);
    console.log('Recommended doctors (test):', rec.map(d => ({ id: d.id, name: d.name })));
  } catch (err) {
    console.error(err);
  }
})();
