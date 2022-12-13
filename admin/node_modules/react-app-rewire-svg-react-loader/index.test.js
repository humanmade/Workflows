const subject = require('./index')
const path = require("path")

describe('SVG React Loader rewire', () => {

    const mockDevelopmentConfig = {
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    enforce: 'pre',
                    use: [
                        {options: {}, loader: path.resolve(__dirname, '/path/to/eslint-loader/index.js')}
                    ],
                    include: path.resolve(__dirname, '/path/to/src')
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: path.resolve(__dirname, '/path/to/url-loader/index.js'),
                            options: {},
                        },
                        {
                            test: /\.(js|jsx|mjs)$/,
                            include: path.resolve(__dirname, '/path/to/src'),
                            loader: path.resolve(__dirname, '/path/to/babel-loader/lib/index.js'),
                            options: {},
                        },
                        {
                            test: /\.css$/,
                            use: [
                                path.resolve(__dirname, '/path/to/style-loader/index.js'),
                                {
                                    loader: path.resolve(__dirname, '/path/to/css-loader/index.js'),
                                    options: {},
                                },
                                {
                                    loader: path.resolve(__dirname, '/path/to/postcss-loader/lib/index.js'),
                                    options: {},
                                },
                            ],
                        },
                        {
                            exclude: [/\.js$/, /\.html$/, /\.json$/],
                            loader: path.resolve(__dirname, '/path/to/file-loader/dist/cjs.js'),
                            options: {name: 'static/media/[name].[hash:8].[ext]'},
                        },
                    ]
                }]
        }
    }

    const mockProductionConfig = {
        module: {
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    enforce: 'pre',
                    use: [
                        {options: {}, loader: path.resolve(__dirname, '/path/to/eslint-loader/index.js')}
                    ],
                    include: path.resolve(__dirname, '/path/to/src')
                },
                {
                    oneOf: [
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            loader: path.resolve(__dirname, '/path/to/url-loader/index.js'),
                            options: {},
                        },
                        {
                            test: /\.(js|jsx|mjs)$/,
                            include: path.resolve(__dirname, '/path/to/src'),
                            loader: path.resolve(__dirname, '/path/to/babel-loader/lib/index.js'),
                            options: {},
                        },
                        {
                            test: /\.css$/,
                            loader: [
                                {
                                    loader: path.resolve(__dirname, '/path/to/extract-text-webpack-plugin/dist/loader.js'),
                                    options: {}
                                },
                                {
                                    loader: path.resolve(__dirname, '/path/to/style-loader/index.js'),
                                    options: {}
                                },
                                {
                                    loader: path.resolve(__dirname, '/path/to/css-loader/index.js'),
                                    options: {}
                                },
                                {
                                    loader: path.resolve(__dirname, '/path/to/postcss-loader/lib/index.js'),
                                    options: {}
                                }
                            ]
                        },
                        {
                            exclude: [/\.js$/, /\.html$/, /\.json$/],
                            loader: path.resolve(__dirname, '/path/to/file-loader/dist/cjs.js'),
                            options: {name: 'static/media/[name].[hash:8].[ext]'},
                        },
                    ]
                }]
        }
    }

    describe('development', () => {

        const result = subject(mockDevelopmentConfig)
        const svgLoader = result.module.rules[1].oneOf[3]
        const fileLoader = result.module.rules[1].oneOf[4]

        it('should set test on the configuration', () => {
            expect(svgLoader.test).toEqual(/\.svg$/)
        })

        it('should set loader on the configuration', () => {
            expect(svgLoader.loader).toContain(`${path.sep}svg-react-loader${path.sep}`)
        })

        it('should insert the SVG loader before the file loader', () => {
            expect(fileLoader.loader).toContain(`${path.sep}file-loader${path.sep}`)
        })
    })

    describe('production', () => {

        const result = subject(mockProductionConfig)
        const svgLoader = result.module.rules[1].oneOf[3]
        const fileLoader = result.module.rules[1].oneOf[4]

        it('should set test on the configuration', () => {
            expect(svgLoader.test).toEqual(/\.svg$/)
        })

        it('should set loader on the configuration', () => {
            expect(svgLoader.loader).toContain(`${path.sep}svg-react-loader${path.sep}`)
        })

        it('should insert the SVG loader before the file loader', () => {
            expect(fileLoader.loader).toContain(`${path.sep}file-loader${path.sep}`)
        })
    })
})
