import { watch } from 'fs'
import { exec } from 'child_process'

watch('./src', { recursive: true }, (e, filename) => {
  console.log('-'.repeat(80))
  console.log(new Date().toLocaleString(), e, filename)
  
  exec('npm run build', (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(new Date().toLocaleString(), 'build finished')
  })
})

console.log('Development mode running. Have fun :D')
