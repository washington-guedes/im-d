const { watch } = require('fs');
const { spawn } = require('child_process');

async function build(event, filename) {
  console.log('-'.repeat(80));
  const startedAt = new Date();
  console.log(`Build started at ${startedAt.toLocaleString()}.`);

  const key = `${event} - ${filename}`;
  console.log(key);

  await new Promise((done) => {
    const job = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
    job.on('exit', done);
  });

  const finishedAt = new Date();
  console.log(`\n${key} ${(finishedAt - startedAt) / 1000} sec`);
  console.log(`Build finished at ${finishedAt.toLocaleString()}.`);
}

watch('./src', { recursive: true }, (ev, filename) => {
  build(ev, filename);
});

build('boot', '/index.js')
  .then(() => console.log('\nDevelopment mode started.\nHave fun :D \n'))
  .catch((e) => console.error(e));
