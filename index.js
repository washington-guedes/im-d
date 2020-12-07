const { watch } = require('fs')
const { exec } = require('child_process')

watch('./src', { recursive: true }, (e, filename) => {
  console.log('-'.repeat(80))
  console.log(new Date().toLocaleString(), e, filename)
  
  exec('npm run build', (err, stdout, stderr) => {
    if (err) {
      console.error(stderr || err)
      return
    }
    console.log((stdout.match(/^(webpack|WARNING).*/gm) || []).join('\n'))
    console.log(new Date().toLocaleString(), 'build finished \n')
  })
})

console.log('Development mode started. Have fun :D \n')
