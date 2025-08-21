export enum CardSuit {
    Clubs = 'Clubs',
    Diamonds = 'Diamonds',
    Hearts = 'Hearts',
    Spades = 'Spades'
}

export enum CardRank {
    Ace = 'A',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K'
}

export class Card {
    constructor(
        public readonly suit: CardSuit,
        public readonly rank: CardRank
    ) { }

    toString(): string {
        return `${this.rank} of ${this.suit}`
    }

    get Value(): number {
        switch (this.rank) {
            case CardRank.Ace:
                return 1 // Ace can be 1 or 11, but we'll use 11 for simplicity
            case CardRank.Jack:
            case CardRank.Queen:
            case CardRank.King:
                return 10 // Face cards are worth 10
            default:
                return parseInt(this.rank) // Numeric cards are worth their face value
        }
    }
}