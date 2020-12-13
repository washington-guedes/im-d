const { watch } = require('fs');
const { spawn } = require('child_process');

async function build(event, filename) {
  console.log('-'.repeat(80));
  console.log(`Build started at ${new Date().toLocaleString()}.`);

  const key = `${event} - ${filename}`;
  console.log(key);
  console.time(key);

  await new Promise((done) => {
    const job = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
    job.on('exit', done);
  });

  console.log('');
  console.timeEnd(key);
  console.log(`Build finished at ${new Date().toLocaleString()}.`);
}

watch('./src', { recursive: true }, (ev, filename) => {
  build(ev, filename);
});

build('boot', '/index.js')
  .then(() => console.log('\nDevelopment mode started.\nHave fun :D \n'))
  .catch((e) => console.error(e));
