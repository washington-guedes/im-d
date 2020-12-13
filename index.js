const { watch } = require('fs');
const { exec } = require('child_process');

watch('./src', { recursive: true }, (e, filename) => {
  hr();
  console.log(new Date().toLocaleString(), e, filename);
  build(() => hr());
});

function hr() {
  console.log('-'.repeat(80));
}

function build(callback) {
  exec('npm run build', (err, stdout, stderr) => {
    if (err) {
      console.error(stderr || err);
      return;
    }
    console.log(stdout);
    console.log(new Date().toLocaleString(), 'build finished \n');

    callback();
  });
}

build(() => console.log('Development mode started. Have fun :D \n'));
