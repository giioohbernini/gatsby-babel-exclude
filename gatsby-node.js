const handleErrors = ({ libraryPaths }) => {
	const libraryArrayLength = libraryPaths.length

	if (libraryArrayLength === 0) {
		throw new Error('You should pass something inside libraryPaths')
	}
}

exports.onCreateWebpackConfig = ({ actions, loaders, getConfig, reporter }, params) => {
  const config = getConfig()
	const { libraryPaths = [] } = params

	handleErrors({ libraryPaths })

	const libraryNames = libraryPaths.join('|')
	const regexpPath = `node_modules\/(${libraryNames})` 

	const customRegex = new RegExp(regexpPath, '')

  config.module.rules = [
    ...config.module.rules.filter(
      rule => String(rule.test) !== String(/\.jsx?$/)
    ),
    {
			...loaders.js(),
			test: /\.js$/,
      // Exclude all node_modules from transpilation, except for 'rv-components*'
      exclude: modulePath =>
        /node_modules/.test(modulePath) &&
        !customRegex.test(modulePath),
    },
  ]

  actions.replaceWebpackConfig(config)
	reporter.success('Paths are successfully excludes from babel')
}
