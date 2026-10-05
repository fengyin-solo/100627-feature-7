// 用 esbuild 的 JS API 打包逻辑验证脚本（CLI shim 在跨平台 node_modules 下不可靠）。
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

await build({
  entryPoints: [join(here, 'verify-logic.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  alias: { '@': join(here, '../src') },
  outfile: join(here, '.verify-logic.bundle.mjs'),
  logLevel: 'silent',
})
