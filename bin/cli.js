#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const inquirer = require('inquirer')

inquirer.prompt([{
    type: 'list',
    name: 'type',
    message: 'which kind of project do you want to create?',
    choices: [{
        name: 'basic webpack project',
        value: 'basic'
    }]
}, {
    type: 'input',
    name: 'name',
    message: 'project name'
}]).then((answer) => {
    const { name, type } = answer
    const tempDir = path.join(__dirname, `../template/${type}`)
    const distDir = process.cwd()
    generateDist(tempDir, distDir, answer)
})
function generateDist(tempDir, distDir, answer) {
    try {
        fs.statSync(distDir).isDirectory()
    } catch(e) {
        fs.mkdirSync(distDir)
    }
    fs.readdir(tempDir, (error, files) => {
        if (error) throw error
        files.forEach(file => {
            const filePath = path.join(tempDir, file)
            if (fs.statSync(filePath).isFile()) {
                ejs.renderFile(filePath, answer).then(content => {
                    fs.writeFileSync(path.join(distDir, file), content)
                })
            } else {
                let dist = `${distDir}/${file}`
                generateDist(filePath, dist, answer )
            }
        })
    })
}