"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomScenario = exports.generateRandomBoard = exports.generateTwoRandomHands = exports.generateRandomHand = exports.dealRandomCards = exports.shuffleArray = exports.generateFullDeck = void 0;
const constants_1 = require("../../lib/constants");
/**
 * Generate a full deck of 52 cards
 */
const generateFullDeck = () => {
    const deck = [];
    for (const rank of constants_1.RANKS) {
        for (const suit of constants_1.SUITS) {
            deck.push(`${rank}${suit}`);
        }
    }
    return deck;
};
exports.generateFullDeck = generateFullDeck;
/**
 * Shuffle an array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
exports.shuffleArray = shuffleArray;
/**
 * Deal random cards from a deck, ensuring no duplicates
 */
const dealRandomCards = (numCards, excludedCards = []) => {
    const fullDeck = (0, exports.generateFullDeck)();
    const availableDeck = fullDeck.filter(card => !excludedCards.includes(card));
    if (numCards > availableDeck.length) {
        throw new Error(`Cannot deal ${numCards} cards from deck with only ${availableDeck.length} available cards`);
    }
    const shuffledDeck = (0, exports.shuffleArray)(availableDeck);
    return shuffledDeck.slice(0, numCards);
};
exports.dealRandomCards = dealRandomCards;
/**
 * Generate a random two-card hand (combo)
 */
const generateRandomHand = (excludedCards = []) => {
    const cards = (0, exports.dealRandomCards)(2, excludedCards);
    return [cards[0], cards[1]];
};
exports.generateRandomHand = generateRandomHand;
/**
 * Generate two random hands for hand-vs-hand comparison
 */
const generateTwoRandomHands = () => {
    const hand1 = (0, exports.generateRandomHand)();
    const hand2 = (0, exports.generateRandomHand)(hand1);
    return [hand1, hand2];
};
exports.generateTwoRandomHands = generateTwoRandomHands;
/**
 * Generate a random board (flop, turn, river)
 */
const generateRandomBoard = (numCards, excludedCards = []) => {
    if (numCards < 0 || numCards > 5) {
        throw new Error("Board must have between 0 and 5 cards");
    }
    return (0, exports.dealRandomCards)(numCards, excludedCards);
};
exports.generateRandomBoard = generateRandomBoard;
/**
 * Generate a complete random scenario: two hands + board
 */
const generateRandomScenario = (boardSize = 0) => {
    const [hand1, hand2] = (0, exports.generateTwoRandomHands)();
    const allDealtCards = [...hand1, ...hand2];
    const board = (0, exports.generateRandomBoard)(boardSize, allDealtCards);
    return {
        hand1,
        hand2,
        board
    };
};
exports.generateRandomScenario = generateRandomScenario;
