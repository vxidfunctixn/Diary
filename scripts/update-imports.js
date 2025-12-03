const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

/**
 * Automatycznie wykrywa przeniesione pliki (git) i aktualizuje importy
 * Uruchom: npm run update-imports
 *
 * Lub manualnie: node scripts/update-imports.js <stara-ścieżka> <nowa-ścieżka>
 */

// Sprawdź czy jesteśmy w trybie manualnym
const args = process.argv.slice(2)

if (args.length >= 2) {
  // Tryb manualny - użytkownik podał ścieżki
  updateImportsManual(args[0], args[1])
} else {
  // Tryb automatyczny - wykryj zmiany z git
  updateImportsAuto()
}

function updateImportsAuto() {
  console.log('🔍 Wykrywanie przeniesionych plików...\n')

  try {
    // Sprawdź status git (renamed files)
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' })
    const deletedFiles = []
    const addedFiles = []
    const renamedFiles = []

    gitStatus.split('\n').forEach(line => {
      // Git oznacza przeniesienia jako "R  old -> new"
      if (line.startsWith('R ') || line.match(/^R\d+/)) {
        const match = line.match(/R\d*\s+(.+?)\s+->\s+(.+)/)
        if (match) {
          renamedFiles.push({
            oldPath: match[1].trim(),
            newPath: match[2].trim()
          })
        }
      }
      // Usunięte pliki
      else if (line.match(/^\s*D\s+/)) {
        const match = line.match(/D\s+(.+)/)
        if (match) {
          deletedFiles.push(match[1].trim())
        }
      }
      // Nowe pliki (untracked)
      else if (line.match(/^\?\?\s+/)) {
        const match = line.match(/\?\?\s+(.+)/)
        if (match) {
          addedFiles.push(match[1].trim())
        }
      }
      // Nowe pliki (staged)
      else if (line.match(/^A\s+/)) {
        const match = line.match(/A\s+(.+)/)
        if (match) {
          addedFiles.push(match[1].trim())
        }
      }
    })

    // Dopasuj usunięte i dodane pliki o tej samej nazwie (prawdopodobnie przeniesione)
    deletedFiles.forEach(deleted => {
      const fileName = path.basename(deleted)
      const possibleNew = addedFiles.find(added => path.basename(added) === fileName)

      if (possibleNew) {
        renamedFiles.push({
          oldPath: deleted,
          newPath: possibleNew
        })
      }
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

    // Aktualizuj importy dla każdego przeniesionego pliku
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

  // Konwertuj do formatu @/ alias
  const oldImport = '@/' + oldPath.replace(/^src\//, '')
  const newImport = '@/' + newPath.replace(/^src\//, '')

  console.log(`\nAktualizacja importów:`)
  console.log(`  Z: ${oldImport}`)
  console.log(`  Na: ${newImport}\n`)

  // Szukaj wszystkich plików .vue, .ts, .tsx
  const srcFiles = findFiles('./src')
  let updatedCount = 0

  srcFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8')
    const oldContent = content

    // Aktualizuj importy (obsługa różnych formatów cytatów i bez rozszerzenia)
    const patterns = [
      // Z rozszerzeniem
      new RegExp(`from ['"]${escapeRegex(oldImport)}['"]`, 'g'),
      // Bez rozszerzenia (dla .vue, .ts itp)
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
