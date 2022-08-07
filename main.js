const fs = require('fs')
const path = '../kuligkamil.github.io/_posts/'
const file = '2022-08-04-code-fun-old.md'
const readline = require('readline')
const puppeteer = require('puppeteer')

function isDate(line) {
    let date = new Date(line.trim())
    // console.log(typeof date)
    return date.toString() !== 'Invalid Date'
}

function isBook(line) {
    return line.trim().slice(-4) === '.pdf'
}

function isEmpty(line) {
    return line.trim() === ''
}

function createFile(name, links, filesNumber) {
    const file = `${path}${name}-01-code-and-fun-${filesNumber}.md`
    const header = `# Code and Fun \\#${filesNumber}\n` +
        '\n' +
        'Every Tuesday, I meet with my colleagues to Code&Fun. This is a monthly links collection. \n' +
        '\n' +
        'Code&Fun:\n' +
        '\n' +
        '* share code, code snippets - not only from work,\n' +
        '* brainstorming problems,\n' +
        '* share good practices,\n' +
        '* highlights from code reviews,\n' +
        '* share interesting articles & repositories.\n\n' +
        '---\n\n'
    let body = ''
    let index = 1
    for (let url in links) {
        body += `${index}. ${links[url]}  \n[${url}](${url})\n`
        index++
    }
    fs.writeFile(file, header + body, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });
}

function isLink(line) {
    return line.trim().includes('http')
}

function getDate(line) {
    let temp = line.trim().split('-')
    return `${temp[0]}-${temp[1]}`
}

function isNewMonth(old = '', date) {
    return getDate(date) !== old
}


function getDescriptions(document) {
    let descriptionProperties = ['og:description', 'twitter:description', 'description']
    for (let descriptionProperty in descriptionProperties) {
        descriptionProperty = document.querySelectorAll(`meta[property=\"${descriptionProperty}\"]`)
        if (descriptionProperty !== null) {
            return descriptionProperty.content
        }
    }
}

async function processLineByLine() {
    try {
        const browser = await puppeteer.launch({headless: false})
        let page
        let linesNumber = 0
        let filesNumber = 1
        let links = {}
        let date = ''
        const fileStream = fs.createReadStream(`${path}${file}`)
        const lines = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
            // Note: we use the crlfDelay option to recognize all instances of CR LF
            // ('\r\n') in input.txt as a single line break.
        })
        for await (const line of lines) {
            if (!isEmpty(line)) {
                if (isDate(line) && !isLink(line) && isNewMonth(date, line)) {
                    if (Object.keys(links).length > 0) {
                        createFile(date, links, filesNumber)
                        links = []
                    }
                    date = getDate(line)
                    filesNumber++
                } else if (isDate(line) && !isNewMonth(date, line)) {
                    continue
                } else {
                    let title = ''
                    if (isLink(line)) {
                        if (isBook(line)) {
                            links[line] = ''
                        } else {
                            page = await browser.newPage()
                            try {
                                await page.goto(line, {waitUntil: 'networkidle2'})
                                title = await page.title()
                                await page.close()
                            } catch (e) {
                                title = ''
                            }
                            // ECMAScript 2021
                            // title = title.replaceAll('|', '\|')
                            links[line] = title.replace(/\|/g, "\\|")
                        }
                    }
                }
                linesNumber++
            }
        }
        createFile(date, links, filesNumber)
        // console.log(linesNumber)
        // console.log(filesNumber)
    } catch (e) {
        console.log(e)
    }
}

processLineByLine().then()

// TODO: get data from links https://github.com/puppeteer/puppeteer
// https://www.youtube.com/watch?v=lgyszZhAZOI&ab_channel=LearnWebCode
// TODO: stackoverflow get text from link
// TODO: to share
// * js Date XD
// new Date('http://siadamgadampelenserwis.pl:8501/')
// Sat Jan 01 8501 00:00:00 GMT+0100 (Central European Standard Time)
// new Date('https://openai.com/dall-e-2/')
// Thu Feb 01 2001 00:00:00 GMT+0100 (Central European Standard Time)
// * Take GitHub to the command line
// GitHub CLI brings GitHub to your terminal. Free and open source
// https://cli.github.com/
// * twine sugarcube
// https://deno.land/
// https://fresh.deno.dev/
// https://ziglang.org/
// https://nixos.org/
// * [line] <- brackets, using variable as a key
// TODO: js vs python
// append vs push
// a++ vs a += 1
// function vs def
// filter, map, reduce
