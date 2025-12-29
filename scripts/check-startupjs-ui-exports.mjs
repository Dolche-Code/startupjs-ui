#!/usr/bin/env node
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const indexPath = path.join(rootDir, 'packages', 'startupjs-ui', 'index.tsx')
const packageJsonPath = path.join(rootDir, 'packages', 'startupjs-ui', 'package.json')

const traverseAst = traverse.default || traverse

async function main () {
  const source = await fs.readFile(indexPath, 'utf8')
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  })

  const exportNames = new Set()

  traverseAst(ast, {
    ExportNamedDeclaration (path) {
      const { node } = path
      if (node.exportKind === 'type') return

      if (node.declaration) {
        const decl = node.declaration
        if (decl.type && decl.type.startsWith('TS')) return
        if (decl.type === 'VariableDeclaration') {
          for (const d of decl.declarations) {
            if (d.id && d.id.type === 'Identifier') exportNames.add(d.id.name)
          }
          return
        }
        if ((decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration') && decl.id) {
          exportNames.add(decl.id.name)
        }
      }

      for (const spec of node.specifiers || []) {
        const exported = spec.exported
        if (!exported) continue
        if (exported.type === 'Identifier') exportNames.add(exported.name)
        else if (exported.type === 'StringLiteral') exportNames.add(exported.value)
      }
    }
  })

  const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
  const exportsMap = pkg.exports || {}

  const missing = []
  for (const name of exportNames) {
    const key = `./${name}`
    if (!Object.prototype.hasOwnProperty.call(exportsMap, key)) {
      missing.push({ name, key })
    }
  }

  if (missing.length) {
    console.error('[check-startupjs-ui-exports] Missing package.json exports entries:')
    for (const item of missing) {
      console.error(`- ${item.name} (expected key "${item.key}")`)
    }
    process.exit(1)
  }

  console.log('[check-startupjs-ui-exports] OK')
}

main().catch(err => {
  console.error('[check-startupjs-ui-exports]', err.message)
  process.exit(1)
})
