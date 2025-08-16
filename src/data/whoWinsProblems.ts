import { WhoWinsProblem } from '../types/whoWinsProblems';

export const whoWinsProblems: WhoWinsProblem[] = [
  {
    id: "ww-001",
    board: ['Ah', 'Ks', 'Qd', 'Jc', 'Th'],
    playerHands: [
      { id: "p1", name: "Player 1", cards: ['As', 'Ad'] },
      { id: "p2", name: "Player 2", cards: ['Kh', 'Kd'] },
      { id: "p3", name: "Player 3", cards: ['Qh', 'Qc'] },
      { id: "p4", name: "Player 4", cards: ['Jh', 'Jd'] },
      { id: "p5", name: "Player 5", cards: ['Th', 'Td'] },
      { id: "p6", name: "Player 6", cards: ['9h', '9d'] }
    ]
  },
  {
    id: "ww-002",
    board: ['Ah', 'As', 'Kd', 'Kc', '2h'],
    playerHands: [
      { id: "p1", name: "Player 1", cards: ['Ad', 'Kh'] },
      { id: "p2", name: "Player 2", cards: ['Qh', 'Qd'] },
      { id: "p3", name: "Player 3", cards: ['Jh', 'Jd'] },
      { id: "p4", name: "Player 4", cards: ['Th', 'Td'] },
      { id: "p5", name: "Player 5", cards: ['9h', '9d'] },
      { id: "p6", name: "Player 6", cards: ['8h', '8d'] }
    ]
  },
  {
    id: "ww-003",
    board: ['Ah', 'Kh', 'Qh', 'Jh', 'Th'],
    playerHands: [
      { id: "p1", name: "Player 1", cards: ['As', 'Ad'] },
      { id: "p2", name: "Player 2", cards: ['Ks', 'Kd'] },
      { id: "p3", name: "Player 3", cards: ['Qs', 'Qd'] },
      { id: "p4", name: "Player 4", cards: ['Js', 'Jd'] },
      { id: "p5", name: "Player 5", cards: ['Ts', 'Td'] },
      { id: "p6", name: "Player 6", cards: ['9s', '9d'] }
    ]
  },
  {
    id: "ww-004",
    board: ['7h', '8h', '9h', 'Th', 'Jh'],
    playerHands: [
      { id: "p1", name: "Player 1", cards: ['Ah', 'Kh'] },
      { id: "p2", name: "Player 2", cards: ['6h', '5h'] },
      { id: "p3", name: "Player 3", cards: ['4h', '3h'] },
      { id: "p4", name: "Player 4", cards: ['2h', 'As'] },
      { id: "p5", name: "Player 5", cards: ['Ks', 'Qs'] },
      { id: "p6", name: "Player 6", cards: ['Js', 'Ts'] }
    ]
  },
  {
    id: "ww-005",
    board: ['Ah', 'Ks', 'Qd', 'Jc', 'Th'],
    playerHands: [
      { id: "p1", name: "Player 1", cards: ['9h', '8h'] },
      { id: "p2", name: "Player 2", cards: ['7h', '6h'] },
      { id: "p3", name: "Player 3", cards: ['5h', '4h'] },
      { id: "p4", name: "Player 4", cards: ['3h', '2h'] },
      { id: "p5", name: "Player 5", cards: ['As', 'Ad'] },
      { id: "p6", name: "Player 6", cards: ['Kh', 'Kd'] }
    ]
  }
];

export function getRandomWhoWinsProblem(): WhoWinsProblem {
  const randomIndex = Math.floor(Math.random() * whoWinsProblems.length);
  return whoWinsProblems[randomIndex];
}
