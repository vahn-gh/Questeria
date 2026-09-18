const { dependencies = {}, devDependencies = {} } = require('../package.json')

const hasError = list => {
  let isErrored = false

  Object.keys(list).forEach(item => {
    const version = list[item]

    if (version.indexOf('^') === 0) {
      isErrored = true

      console.error(
        `Error: Dependency '${item}' is not used locked versioning '${version}' should be '${version.replace('^', '')}'`
      )
    }
  })

  return isErrored
}

if (hasError(dependencies) || hasError(devDependencies)) {
  process.exit(1)
}
