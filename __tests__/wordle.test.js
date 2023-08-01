import { jest } from '@jest/globals'

const mockIsWord = jest.fn(() => true)
jest.unstable_mockModule('../src/words.js', () => {
    return {
        getWord: jest.fn(() => 'APPLE'),
        isWord: mockIsWord,
    }
})

const { Wordle, buildLetter } = await import('../src/wordle.js')

describe('building a letter object', () => {
    test('returns a letter object', () => {
        expect(buildLetter("L", "Lazy")).toEqual({letter: "L", status: "Lazy"})
    })
})

describe('constructing a new Wordle game', () => {
    test('returns 6 max guesses if none provided', () => {
        const newWordle = new Wordle()
        expect(newWordle.maxGuesses).toEqual(6)
    })
    
    test('returns number of max guesses provided', () => {
        const newWordle = new Wordle(12)
        expect(newWordle.maxGuesses).toEqual(12)
    })
    
    test('sets guesses to an array of length maxGuesses', () => {
        const newWordle = new Wordle(9)
        expect(newWordle.guesses.length).toEqual(9)
    })
    
    test('sets currGuess to 0', () => {
        const newWordle = new Wordle(8)
        expect(newWordle.currGuess).toEqual(0)
    })

    test('check value of word property is "APPLE"', () => {
        const newWordle = new Wordle()
        expect(newWordle.word).toEqual("APPLE")
    })
})

describe('testing Wordle.buildGuessFromWord', () => {
    test('sets status of a correct letter to "CORRECT"', () => {
        const newWordle = new Wordle()
        expect(newWordle.buildGuessFromWord("A____")[0]).toEqual({ letter: "A", status: "CORRECT" })
    })

    test('sets status of a present letter to PRESENT', () => {
        const newWordle = new Wordle()
        expect(newWordle.buildGuessFromWord("E____")[0]).toEqual({ letter: "E", status: "PRESENT" })
    })

    test('sets status of an absent letter to ABSENT', () => {
        const newWordle = new Wordle()
        expect(newWordle.buildGuessFromWord("Z____")[0]).toEqual({ letter: "Z", status: "ABSENT" })
    })
})

describe('testing Wordle.appendGuess', () => {
    test('throws an error if no more guesses are allowed', () => {
        const newWordle = new Wordle(1)
        newWordle.appendGuess("A____")
        expect(() => {
            newWordle.appendGuess("B____")
        }).toThrow()
    })

    test('throws an error if guess is not of length 5', () => {
        const newWordle = new Wordle()
        expect(() => newWordle.appendGuess("ABCDEF")).toThrow()
    })

    test('throws an error if the guess is not a word', () => {
        const newWordle = new Wordle()
        mockIsWord.mockReturnValueOnce(false)
        expect(() => newWordle.appendGuess("ABCDE")).toThrow()
    })

    test('increments the current guess', () => {
        const newWordle = new Wordle()
        newWordle.appendGuess("A____")
        expect(newWordle.currGuess).toEqual(1)
    })
})

describe('testing Wordle.isSolved', () => {
    test('returns true if the latest guess is the correct word', () => {
        const newWordle = new Wordle()
        newWordle.appendGuess("APPLE")
        expect(newWordle.isSolved()).toEqual(true)
    })
    
    test('returns false if the latest guess is not the correct word', () => {
        const newWordle = new Wordle()
        newWordle.appendGuess("A____")
        expect(newWordle.isSolved()).toBe(false)
    })
})

describe('testing Wordle.shouldEndGame', () => {
    test('returns true if the latest guess is the correct word', () => {
        const newWordle = new Wordle()
        newWordle.appendGuess("APPLE")
        expect(newWordle.shouldEndGame()).toBe(true)
    })

    test('returns true if there are no more guesses left', () => {
        const newWordle = new Wordle(1)
        newWordle.appendGuess("X____")
        expect(newWordle.shouldEndGame()).toBe(true)
    })

    test('returns false if no guess has been made', () => {
        const newWordle = new Wordle()
        expect(newWordle.shouldEndGame()).toBe(false)
    })

    test('returns false if there are guesses left and the word has not been guessed', () => {
        const newWordle = new Wordle()
        newWordle.appendGuess("A____")
        expect(newWordle.shouldEndGame()).toBe(false)
    })
})