import {getDate, isBook, isDate, isEmpty, isLink, isNewMonth} from "../../utils";

describe('Unit Test Application Code', function () {
    // const {add, divide, multiply, subtract} = math

    before(() => {
        // check if the import worked correctly
        // expect(add, 'add').to.be.a('function')
    })

    it('is a book?', () => {
        expect(isBook('Harry Potter.pdf')).to.be.true
    })
    it('', () => {
        expect(isEmpty('     ')).to.be.true
    })
    it('', () => {
        expect(isLink('https://docs.cypress.io')).to.be.true
    })
    it('', () => {
        expect(getDate('2022-02-01')).eq('2022-02')
    })
    it('isDate', () => {
        expect(isDate('2022-02-01')).to.be.true
    })
    it('', () => {
        expect(isNewMonth('3','2')).to.be.true
    })
    // it('', () => {
    //     expect().to.be.true
    // })
    // it('', () => {
    //     expect().to.be.true
    // })

})