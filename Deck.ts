
import { CardSuit, CardRank, Card } from "./Card"

export class Deck {
    private cards: Card[] = [];
    private currentIndex: number = 0;

    constructor() {
        this.initializeDeck()
    }

    reset(): void {
        this.cards = []
        this.initializeDeck()
    }

    private initializeDeck(): void {
        this.currentIndex = 0
        for (const suit of Object.values(CardSuit)) {
            for (const rank of Object.values(CardRank)) {
                this.cards.push(new Card(suit, rank))
            }
        }
    }

    shuffle(times: number = 50): void {
        for (let i = 0; i < times; i++) {
            const j = Math.floor(Math.random() * this.cards.length) as number
            const k = Math.floor(Math.random() * this.cards.length) as number
            //@ts-ignore
            [this.cards[j], this.cards[k]] = [this.cards[k], this.cards[j]]
        }
        this.currentIndex = 0
    }

    getCard(): Card {
        if (this.currentIndex >= this.cards.length) {
            throw new Error("No more cards in the deck")
        }
        const card = this.cards[this.currentIndex]!
        this.currentIndex++
        return card
    }

}