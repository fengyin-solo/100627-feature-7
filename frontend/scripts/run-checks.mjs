// 逻辑校验入口：把校验用 TS 打成 cjs 后在 node 里跑，无需浏览器。
// 用法：node scripts/run-checks.mjs flow | migrate
import { build } from 'esbuild'
import { readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'

const mode = process.argv[2] ?? 'flow'
const entry = mode === 'migrate' ? 'scripts/migrate-check.ts' : 'scripts/flow-check.ts'
const outfile = `scripts/.${mode}-check.built.cjs`

const options = {
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile,
  alias: { '@': resolve('src') },
}
if (mode === 'migrate') {
  // 迁移用例需要先塞入旧版结构的 localStorage，stub 本身是无类型语法的 TS，可直接前置。
  options.banner = { js: readFileSync('scripts/migrate-stub.ts', 'utf8') }
}

await build(options)
try {
  const require = createRequire(import.meta.url)
  require(resolve(outfile))
} finally {
  rmSync(outfile, { force: true })
}
