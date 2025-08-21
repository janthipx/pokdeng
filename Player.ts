import type { Card } from "./Card"

export class Hand {
    private cards: Card[] = [];

    addCard(card: Card): void {
        this.cards.push(card)
    }

    get Value(): number {
        return this.cards.reduce((total, card) => total + card.Value, 0) % 10
    }

    reset(): void {
        this.cards = []
    }

    get isPok(): boolean {
        return this.cards.length === 2 && this.Value >= 8
    }
    
    get isDeng(): boolean {
        return this.cards.length === 2 && this.cards[0]?.suit === this.cards[1]?.suit
    }
    
    // เพิ่มเมธอดเพื่อเข้าถึงไพ่ในมือ
    get card(): Card[] {
        return [...this.cards]; // ส่งคืนสำเนาของอาร์เรย์ไพ่
    }
    
    // เพิ่มเมธอดแสดงไพ่แต่ละใบในรูปแบบข้อความ
    getCardsAsString(): string {
        if (this.cards.length === 0) {
            return "ไม่มีไพ่";
        }
        return this.cards.map(card => card.toString()).join(", ");
    }

    toString(): string {
        let text = `แต้ม: ${this.Value} [${this.getCardsAsString()}] `
        if (this.isPok) {
            text += '(ป๊อก) '
        }
        if (this.isDeng) {
            text += '(เด้ง) '
        }
        return text
    }
}

export class Player {
    private _bet: number = 0
    private _status: string = "พร้อมเล่น"; // สถานะของผู้เล่น
    
    constructor(
        private _money: number,
        private readonly _id: string,
        private _hands: Hand[]
    ) { }

    set money(amount: number) {
        this._money = amount;
        this.updateStatus(); // อัปเดตสถานะเมื่อเงินเปลี่ยน
    }
    
    get money(): number {
        return this._money < 0 ? 0 : this._money
    }

    get id(): string {
        return this._id
    }

    get hands(): Hand[] {
        return this._hands
    }

    reset(): void {
        for (const hand of this._hands) {
            hand.reset()
        }
        this.updateStatus(); // อัปเดตสถานะเมื่อรีเซ็ต
    }

    setBet(amount: number): void {
        if (amount < 0 || amount > this.money) {
            amount = this.money
        }
        this._bet = amount
        this._status = "กำลังเล่น"; // อัปเดตสถานะเมื่อลงเดิมพัน
    }

    get bet(): number {
        return this._bet
    }

    isBroke(): boolean { // เพิ่ม method นี้เพื่อเช็คว่า ผู้เล่นนั้นเงินหมดหรือไม่
        return this.money <= 0
    }

    setMoney(amount: number): void {
        this._money = amount;
        this.updateStatus(); // อัปเดตสถานะเมื่อเงินเปลี่ยน
    }
    
    // เพิ่มเมธอดสำหรับอัปเดตสถานะของผู้เล่น
    private updateStatus(): void {
        if (this.isBroke()) {
            this._status = "หมดตัว";
        } else if (this._money > 1000) {
            this._status = "รวย";
        } else {
            this._status = "พร้อมเล่น";
        }
    }
    
    // เพิ่มเมธอดสำหรับตั้งค่าสถานะโดยตรง
    setStatus(status: string): void {
        this._status = status;
    }
    
    // เพิ่มเมธอดสำหรับดึงค่าสถานะ
    get status(): string {
        return this._status;
    }
    
    // เพิ่มเมธอดสำหรับแสดงข้อมูลผู้เล่น
    getPlayerInfo(): string {
        return `${this.id} - เงิน: ${this.money} บาท, สถานะ: ${this._status}`;
    }
    
    // เพิ่มเมธอดสำหรับแสดงข้อมูลการเดิมพัน
    getBetInfo(): string {
        return `${this.id} - เดิมพัน: ${this.bet} บาท, เงินคงเหลือ: ${this.money - this.bet} บาท`;
    }
}