const years = [
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030"
];
const rounds = [1, 2, 3, 4, 5];
const players = [
  {
    id: 1,
    name: "Charlie"
  },
  {
    id: 2,
    name: "Shane"
  },
  {
    id: 3,
    name: "Tom"
  },
  {
    id: 4,
    name: "Dan"
  },
  {
    id: 5,
    name: "Travis"
  },
  {
    id: 6,
    name: "Chuck"
  },
  {
    id: 7,
    name: "Steve"
  },
  {
    id: 8,
    name: "Brandon"
  }
];

const genData = () => {
  const picks = {};

  years.map(y => {
    let arr = [];

    rounds.map((r, i) => {
      let round = {
        round: i,
        picks: []
      };
      let pi = i;

      players.map((p, i) => {
        round.picks.push({
          pick: `${y}-${round.round + 1}-${i + 1}`,
          owner: players[i].id,
          prevOwners: []
        });
      });

      arr.push(round);
    });
    picks[y] = arr;
  });

  return picks;
};

export { rounds, players, years, genData };
