const fs = require('fs')
const path = '../kuligkamil.github.io/_posts/';
const file = '2022-08-04-code-fun-old.md';
const readline = require('readline');
const puppeteer = require('puppeteer');

function isDate(line) {
    let date = new Date(line.trim())
    // console.log(typeof date)
    return date.toString() !== 'Invalid Date'
}

function isEmpty(line) {
    return line.trim() === ''
}

function createFile(name, links) {
    console.log(name, links.length)
    // fs.writeFile('', 'Learn Node FS module', function (err) {
    //     if (err) throw err;
    //     console.log('File is created successfully.');
    // });
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
        console.log('Code&Fun')
        const fileStream = fs.createReadStream(`${path}${file}`)
        const lines = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
            // Note: we use the crlfDelay option to recognize all instances of CR LF
            // ('\r\n') in input.txt as a single line break.
        });
        let linesNumber = 0
        let filesNumber = 0
        let links = []
        let date = ''
        for await (const line of lines) {
            if (!isEmpty(line)) {
                if (isDate(line) && !isLink(line) && isNewMonth(date, line)) {
                    filesNumber++
                    if (links.length > 0) {
                        createFile(date, links)
                        links = []
                    }
                    date = getDate(line)
                } else {
                    if (isLink(line)) {
                        page = await browser.newPage();
                        await page.goto(line, {waitUntil: 'networkidle2'})
                        // const desc = getDescriptions()
                        // console.log(desc)
                        let list = await page.evaluate(() =>
                            // {
                            //     let descriptionProperties = ['og:description', 'twitter:description', 'description']
                            //     for (let descriptionProperty in descriptionProperties) {
                            //         descriptionProperty = document.querySelectorAll(`meta[property=\"${descriptionProperty}\"]`)
                            //
                            //         if (descriptionProperty !== null) {
                            //             return descriptionProperty.content
                            //         }
                            //     }
                            // })
                            //
                            Array.from(document.querySelectorAll('meta'),
                                (e) => {
                                    if (e.getAttributeNames().includes('property')) {
                                        if (e.getAttribute('property').includes('desc')) {
                                            return e.content
                                        }
                                    }
                                    if (e.getAttributeNames().includes('name')) {
                                        if (e.getAttribute('name').includes('desc')) {
                                            return e.content
                                        }
                                    }
                                }))
                        //
                        // // const descriptionTag = await page.$('meta[name="description"]')
                        // // let a = 7
                        // // const description = await descriptionTag?.getAttribute('content')
                        list = list.filter(a => a !== null)
                        console.log(list[0])
                        desc = list.sort(function (a, b) {
                            return b.length - a.length
                        })[0];
                        console.log(desc)
                    }
                    links.push(line)
                }
                linesNumber++
            }
        }
        createFile(date, links)
        console.log(linesNumber)
        console.log(filesNumber)
    } catch (e) {
        console.log(e)
    }
}

processLineByLine().then()

// TODO: get data from links https://github.com/puppeteer/puppeteer
// https://www.youtube.com/watch?v=lgyszZhAZOI&ab_channel=LearnWebCode
// TODO: to share
// * js Date XD
// new Date('http://siadamgadampelenserwis.pl:8501/')
// Sat Jan 01 8501 00:00:00 GMT+0100 (Central European Standard Time)
// new Date('https://openai.com/dall-e-2/')
// Thu Feb 01 2001 00:00:00 GMT+0100 (Central European Standard Time)
// * Take GitHub to the command line
// GitHub CLI brings GitHub to your terminal. Free and open source
// https://cli.github.com/
// TODO: js vs python
// append vs push
// a++ vs a += 1
// function vs def
