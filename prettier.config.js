module.exports = {
    tabWidth: 2,
    printWidth: 300,
    trailingComma: "es5",
    bracketSpacing: false,
    overrides: [
        {
            files: ["*.ts", "*.tsx", "*.js", "*.jsx", "*.json"],
            options: {
                tabWidth: 4,
            },
        },
    ],
};
