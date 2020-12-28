#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const ejs= require('ejs')
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
    /**
     * todo:
     * 1. 在当前工作目录下创建项目文件夹， 把该文件夹的绝对路径作为文件拷贝的目的路径
     * 2. 将template中的文件使用ejs渲染， 同时拷贝到目的路径
     * 
     */
    try {
        const distDir = `${process.cwd()}/${name}`
        fs.mkdirSync(distDir)
        const tempDir = path.join(__dirname, `../template/${type}`)
        generateDist(tempDir, distDir, answer)
    } catch(e) {
        console.log(e.message)
    }
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