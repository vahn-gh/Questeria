const { existsSync } = require('fs')
const { execFileSync } = require('child_process')
const path = require('path')

const LIBRARIES_DIR = path.resolve(__dirname, '../libraries')

const libraries = [
  {
    name: 'react-native-pixelkit',
    repo: 'git@github.com:vahn-gh/react-native-pixelkit.git',
  },
]

libraries.forEach(({ name, repo }) => {
  const target = path.join(LIBRARIES_DIR, name)

  if (existsSync(target)) {
    return
  }

  console.log(`Cloning ${name} into libraries/${name}...`)
  execFileSync('git', ['clone', repo, target], { stdio: 'inherit' })
})
