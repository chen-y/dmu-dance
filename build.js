import fs from 'fs'

fs.copyFile('./src/dm.css', 'lib/dm.css',  (err) => {
  if (err) {
    console.error('error *', err)
  }
});