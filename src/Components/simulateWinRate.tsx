// simulateWinRate.ts

const parseCardValue = (card: string): number => {
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    return values.indexOf(card) + 2;
  };
  
  const parseUserHand = (userHand: string): number[] => {
    const cards = userHand.trim().split(' ');
    return cards.map((card) => parseCardValue(card));
  };
  
  const simulateOpponentHand = (): number[] => {
    const randomCardValue = () => Math.floor(Math.random() * 13) + 2; // 2 to A
    return [randomCardValue(), randomCardValue()];
  };
  
  const compareHands = (userHand: number[], opponentHand: number[]): boolean => {
    const userTotal = userHand.reduce((total, card) => total + card, 0);
    const opponentTotal = opponentHand.reduce((total, card) => total + card, 0);
    return userTotal > opponentTotal;
  };
  
  const simulateWinRate = (userHandStr: string): number => {
    const userHand = parseUserHand(userHandStr);
    let winCount = 0;
    const numSimulations = 10000;
  
    for (let i = 0; i < numSimulations; i++) {
      const opponentHand = simulateOpponentHand();
      const userWins = compareHands(userHand, opponentHand);
      if (userWins) {
        winCount++;
      }
    }
  
    return (winCount / numSimulations) * 100;
  };
  
  export default simulateWinRate;
  