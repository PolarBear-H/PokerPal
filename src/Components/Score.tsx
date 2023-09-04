export default interface Score {
    startDate: Date;
    endDate: Date;
    breakTime: number;
    duration: number;
    location: string;
    playerCount: number | null;
    betUnit: string;
    buyInAmount: number;
    remainingBalance: number;
    chipsWon: number;
}