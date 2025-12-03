const fs = require('fs')
const path = require('path')

/**
 * Skrypt pomocniczy do aktualizowania importów po przeniesieniu plików
 * Uruchom: node scripts/update-imports.js <stara-ścieżka> <nowa-ścieżka>
 */

const args = process.argv.slice(2)
if (args.length < 2) {
  console.log('Użycie: node scripts/update-imports.js <stara-ścieżka> <nowa-ścieżka>')
  console.log(
    'Przykład: node scripts/update-imports.js src/components/old.vue src/components/new/old.vue'
  )
  process.exit(1)
}

const oldPath = args[0].replace(/\\/g, '/')
const newPath = args[1].replace(/\\/g, '/')

// Wyciągnij nazwę pliku i katalog
const oldDir = path.dirname(oldPath)
const newDir = path.dirname(newPath)
const fileName = path.basename(newPath)

// Konwertuj do formatu @/ alias
const oldImport = '@/' + oldPath.replace('src/', '')
const newImport = '@/' + newPath.replace('src/', '')

console.log(`Aktualizacja importów:\n  Z: ${oldImport}\n  Na: ${newImport}\n`)

// Szukaj wszystkich plików .vue, .ts, .tsx
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('dist')) {
        findFiles(filePath, fileList)
      }
    } else if (file.match(/\.(vue|ts|tsx)$/)) {
      fileList.push(filePath)
    }
  })

  return fileList
}

const srcFiles = findFiles('./src')
let updatedCount = 0

srcFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8')
  const oldContent = content

  // Aktualizuj importy (obsługa różnych formatów cytatów)
  content = content.replace(
    new RegExp(`from ['"]${oldImport.replace(/\//g, '\\/')}['"]`, 'g'),
    `from '${newImport}'`
  )

  if (content !== oldContent) {
    fs.writeFileSync(file, content, 'utf8')
    console.log(`✓ Zaktualizowano: ${file}`)
    updatedCount++
  }
})

console.log(`\nZakończono. Zaktualizowano ${updatedCount} plików.`)
