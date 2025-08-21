import type { Deck } from "./Deck"
import { Hand, Player } from "./Player"

export class PokdengGame {
    private _players: Player[] = [];
    constructor(private _dealer: Player, private _deck: Deck) { }

    addPlayer(player: Player): void {
        this._players.push(player)
    }
    
    // เพิ่มเมธอดสำหรับเข้าถึงรายชื่อผู้เล่น
    get players(): Player[] {
        return this._players;
    }
    
    // เพิ่มเมธอดสำหรับลบผู้เล่นที่ระบุ
    removePlayer(index: number): void {
        if (index >= 0 && index < this._players.length) {
            this._players.splice(index, 1);
        }
    }
    
    // เพิ่มเมธอดสำหรับรับค่าผู้เล่นจากผู้ใช้
    createPlayers(): void {
        const numPlayers = Number(prompt("จำนวนผู้เล่น: "));
        const startMoney = Number(prompt("เงินเริ่มต้นของผู้เล่นทุกคน: "));

        for (let i = 0; i < numPlayers; i++) {
            const id = `player${i+1}`;
            let numHands = Number(prompt(`จำนวนขาไพ่ของ ${id} (1 หรือ 2): `));
            if (numHands < 1) numHands = 1;
            if (numHands > 2) numHands = 2;
            const hands = Array.from({ length: numHands }, () => new Hand());
            this.addPlayer(new Player(startMoney, id, hands));
        }
    }

    dealerVsPlayer(player: Player): void {
        console.log(`\n=== Dealer vs ${player.id} ===`)
        const dealerHand = this._dealer.hands[0]!
        console.log(`Dealer's hand: ${dealerHand.toString()}`)
        
        let handIndex = 1
        for (const playerHand of player.hands) {
            console.log(`${player.id} hand ${handIndex}: ${playerHand.toString()}`)
            let result: string = ''
            
            if (dealerHand.isPok && !playerHand.isPok) {// player lose
                let bet = player.bet
                player.money = player.money - player.bet
                result = 'Dealer wins with Pok' + dealerHand.Value
                if (dealerHand.isDeng) {// dealer win with deng
                    player.money = player.money - player.bet
                    bet += bet
                    result += ' and Deng'
                }
                result += `, Player ${playerHand.toString()} `
                result += ` loses ${bet}`

            } else if (dealerHand.isPok && playerHand.isPok) {// both pok
                if (dealerHand.Value > playerHand.Value) {// dealer win
                    player.money = player.money - player.bet
                    result = `Dealer wins with Pok ${dealerHand.Value} vs Player's Pok ${playerHand.Value} , Player loses ${player.bet}`
                } else if (dealerHand.Value < playerHand.Value) {// player win
                    player.money = player.money + player.bet
                    result = `Player wins with Pok ${playerHand.Value} vs Dealer's Pok ${dealerHand.Value} , Player got ${player.bet}`
                } else { // เพิ่มกรณีเสมอกัน
                    result = `Draw! Both have Pok ${dealerHand.Value}`
                }
            } else if (!dealerHand.isPok && playerHand.isPok) {
                player.money = player.money + player.bet
                let bet = player.bet
                result = `Dealer loses with ${dealerHand.toString()}, `
                result += `Player wins with Pok ${playerHand.Value}`
                if (playerHand.isDeng) {// player win with deng
                    player.money = player.money + player.bet
                    bet += bet
                    result += ' and Deng'
                }
                result += `, Player got ${bet}`
            } else {
                if (dealerHand.Value > playerHand.Value) {// dealer win
                    result = `Dealer wins with ${dealerHand.Value} vs Player's ${playerHand.Value} , Player loses ${player.bet}`
                    player.money = player.money - player.bet
                } else if (dealerHand.Value < playerHand.Value) {// player win
                    player.money = player.money + player.bet
                    result = `Player wins with ${playerHand.Value} vs Dealer's ${dealerHand.Value} , Player got ${player.bet}`
                } else { // เพิ่มกรณีเสมอกัน
                    result = `Draw! Both have ${dealerHand.Value} points`
                }
            }
            console.log(`   -> ${result}`)
            console.log(`   -> ${player.id} money: ${player.money}`)
            handIndex++
        }
    }

    deal(player: Player): void {
        for (const hand of player.hands) {
            hand.addCard(this._deck.getCard())
        }
    }
    
    // เพิ่มเมธอดสำหรับรับค่า bet จากผู้ใช้ทีละคน
    collectBets(): void {
        for (const player of this._players) {
            if (!player.isBroke()) {
                const bet = Number(prompt(`${player.id} (เงินคงเหลือ ${player.money}) ใส่ bet: `));
                player.setBet(bet);
                console.log(`${player.id} ลง bet: ${player.bet}`);
            }
        }
    }
    
    play(): void {
        console.log("\n===== เริ่มเกมใหม่ =====");
        this._dealer.reset()
        this._deck.reset()
        this._deck.shuffle(50)
        for (const player of this._players) {
            player.reset()
            // player.setBet(100) // Removed: bet is set from main
        }
        
        // เก็บค่า bet จากผู้เล่นทีละคน
        this.collectBets();

        console.log("\n===== แจกไพ่ =====");
        for (let index = 0; index < 2; index++) {
            this.deal(this._dealer)
            for (const player of this._players) {
                this.deal(player)
            }
        }
        
        console.log("\n===== ผลการเล่น =====");
        for (const player of this._players) {
            this.dealerVsPlayer(player)
        }
        
        // แสดงผลสรุปของเกม
        console.log("\n===== สรุปผลเกม =====");
        console.log(`เงินของดีลเลอร์: ${this._dealer.money}`);
        
        // เรียงลำดับผู้เล่นตามเงินที่มี
        const sortedPlayers = [...this._players].sort((a, b) => b.money - a.money);
        
        console.log("อันดับผู้เล่น:");
        sortedPlayers.forEach((player, index) => {
            console.log(`${index + 1}. ${player.id} - เงินคงเหลือ: ${player.money}`);
        });
        
        // แสดงผู้เล่นที่หมดตัว
        const brokePlayers = this._players.filter(player => player.isBroke());
        if (brokePlayers.length > 0) {
            console.log("\nผู้เล่นที่หมดตัว:");
            brokePlayers.forEach(player => {
                console.log(`- ${player.id}`);
            });
        }
    }
}