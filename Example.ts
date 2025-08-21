
import { Deck } from "./Deck"
import { Hand, Player } from "./Player"
import { PokdengGame } from "./PokdengGame"
//const prompt = require('prompt-sync')()

const dealer = new Player(0, "dealer", [new Hand()]);
const deck = new Deck();
const game = new PokdengGame(dealer, deck);

// ใช้ฟังก์ชันใหม่ในการรับค่าผู้เล่นจากผู้ใช้
game.createPlayers();

// เล่นเกมจนกว่าจะเหลือผู้เล่นน้อยกว่า 2 คน
while (game.players.length > 1) {
    // ไม่ต้องรับค่า bet ที่นี่แล้ว เพราะจะรับในเมธอด play() ของ PokdengGame
    game.play();

    // ตรวจสอบผู้เล่นที่เงินหมด
    for (let i = game.players.length - 1; i >= 0; i--) {
        if (game.players[i]!.isBroke()) {
            console.log(`${game.players[i]!.id} เงินหมด ตกรอบ!`)
            game.removePlayer(i);
        }
    }
}

// ประกาศผู้ชนะ
if (game.players.length > 0) {
    console.log(`ผู้ชนะคือ ${game.players[0]!.id}`)
} else {
    console.log("ไม่มีผู้ชนะ ทุกคนเงินหมด!")
}

// class mockPlayer extends Player {
//     constructor(money: number, id: string, hands: Hand[]) {
//         super(money, id, hands)
//     }
// }
// const pokdengGame = new PokdengGame(new mockPlayer(1, 'dealer', [new Hand()]), new Deck())
// pokdengGame.addPlayer(new Player(5000, 'player1', [new Hand(), new Hand()]))
// pokdengGame.play()