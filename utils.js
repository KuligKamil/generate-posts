const isDate = (text) => new Date(text.trim()).toString() !== 'Invalid Date'

const isBook = (text) => text.trim().slice(-4) === '.pdf'

const isEmpty = (text) => text.trim() === ''

const isLink = (text) => text.trim().includes('http')

const isNewMonth = (oldDate = '', newDate) => newDate !== oldDate

const getDate = (text) => {
    const [year, month] = text.trim().split('-')
    return `${year}-${month}`
}

export {isEmpty, isLink, isNewMonth, isBook, getDate, isDate}