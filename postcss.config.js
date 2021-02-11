module.exports = {
    plugins:[
        require('tailwindcss'),
        require('autoprefixer'),
        require('@fullhuman/postcss-purgecss')({
            content:[
                './views/*.ejs',
                './webPages/*.html',
            ],
            defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g)
        })
    ]
}