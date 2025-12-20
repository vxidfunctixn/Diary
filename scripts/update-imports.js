const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const args = process.argv.slice(2)

if (args.length >= 2) {
  updateImportsManual(args[0], args[1])
} else {
  updateImportsAuto()
}

function updateImportsAuto() {
  console.log('🔍 Wykrywanie przeniesionych plików...\n')

  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' })
    const deletedFiles = []
    const addedFiles = []
    const renamedFiles = []

    gitStatus.split('\n').forEach(line => {
      if (line.startsWith('R ') || line.match(/^R\d+/)) {
        const match = line.match(/R\d*\s+(.+?)\s+->\s+(.+)/)
        if (match) {
          renamedFiles.push({
            oldPath: match[1].trim(),
            newPath: match[2].trim()
          })
        }
      } else if (line.match(/^\s*D\s+/)) {
        const match = line.match(/D\s+(.+)/)
        if (match) {
          deletedFiles.push(match[1].trim())
        }
      } else if (line.match(/^\?\?\s+/)) {
        const match = line.match(/\?\?\s+(.+)/)
        if (match) {
          addedFiles.push(match[1].trim())
        }
      } else if (line.match(/^A\s+/)) {
        const match = line.match(/A\s+(.+)/)
        if (match) {
          addedFiles.push(match[1].trim())
        }
      }
    })

    try {
      const gitDiff = execSync('git diff --cached --name-status', { encoding: 'utf8' })
      gitDiff.split('\n').forEach(line => {
        const match = line.match(/^R\d*\s+(.+?)\s+(.+)/)
        if (match) {
          const renamed = {
            oldPath: match[1].trim(),
            newPath: match[2].trim()
          }
          if (
            !renamedFiles.some(r => r.oldPath === renamed.oldPath && r.newPath === renamed.newPath)
          ) {
            renamedFiles.push(renamed)
          }
        }
      })
    } catch (e) {}

    deletedFiles.forEach(deleted => {
      const deletedName = path.basename(deleted)
      const deletedDir = path.dirname(deleted)
      const deletedExt = path.extname(deleted)

      addedFiles.forEach(added => {
        const addedName = path.basename(added)
        const addedDir = path.dirname(added)
        const addedExt = path.extname(added)

        const alreadyPaired = renamedFiles.some(r => r.oldPath === deleted || r.newPath === added)
        if (alreadyPaired) return

        if (deletedName === addedName) {
          renamedFiles.push({
            oldPath: deleted,
            newPath: added
          })
        } else if (deletedDir === addedDir && deletedExt === addedExt) {
          renamedFiles.push({
            oldPath: deleted,
            newPath: added
          })
        }
      })
    })

    if (renamedFiles.length === 0) {
      console.log('✓ Nie znaleziono przeniesionych plików.')
      console.log(
        '\nAby użyć ręcznie: node scripts/update-imports.js <stara-ścieżka> <nowa-ścieżka>'
      )
      console.log('\nWykryte zmiany:')
      if (deletedFiles.length > 0) console.log(`  Usunięte: ${deletedFiles.length}`)
      if (addedFiles.length > 0) console.log(`  Dodane: ${addedFiles.length}`)
      return
    }

    console.log(`Znaleziono ${renamedFiles.length} przeniesionych plików:\n`)

    renamedFiles.forEach(({ oldPath, newPath }) => {
      console.log(`  ${oldPath} → ${newPath}`)
    })

    console.log('\n' + '='.repeat(60) + '\n')

    let totalUpdated = 0
    renamedFiles.forEach(({ oldPath, newPath }) => {
      const count = updateImports(oldPath, newPath)
      totalUpdated += count
    })

    console.log('\n' + '='.repeat(60))
    console.log(`\n✓ Zakończono. Zaktualizowano ${totalUpdated} importów.`)
  } catch (error) {
    if (error.message.includes('not a git repository')) {
      console.error('❌ Błąd: Ten katalog nie jest repozytorium git.')
      console.log(
        '\nUżyj trybu manualnego: node scripts/update-imports.js <stara-ścieżka> <nowa-ścieżka>'
      )
    } else {
      console.error('❌ Błąd:', error.message)
    }
    process.exit(1)
  }
}

function updateImportsManual(oldPath, newPath) {
  console.log('📝 Tryb manualny\n')
  const count = updateImports(oldPath, newPath)
  console.log(`\n✓ Zakończono. Zaktualizowano ${count} plików.`)
}

function updateImports(oldPath, newPath) {
  oldPath = oldPath.replace(/\\/g, '/')
  newPath = newPath.replace(/\\/g, '/')

  const oldImport = '@/' + oldPath.replace(/^src\//, '')
  const newImport = '@/' + newPath.replace(/^src\//, '')

  console.log(`\nAktualizacja importów:`)
  console.log(`  Z: ${oldImport}`)
  console.log(`  Na: ${newImport}\n`)

  const srcFiles = findFiles('./src')
  let updatedCount = 0

  srcFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8')
    const oldContent = content

    const patterns = [
      new RegExp(`from ['"]${escapeRegex(oldImport)}['"]`, 'g'),
      new RegExp(`from ['"]${escapeRegex(oldImport.replace(/\.(vue|ts|tsx)$/, ''))}['"]`, 'g')
    ]

    patterns.forEach(pattern => {
      content = content.replace(pattern, `from '${newImport}'`)
    })

    if (content !== oldContent) {
      fs.writeFileSync(file, content, 'utf8')
      console.log(`  ✓ ${file}`)
      updatedCount++
    }
  })

  if (updatedCount === 0) {
    console.log('  (brak plików do zaktualizowania)')
  }

  return updatedCount
}

function findFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList

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

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
