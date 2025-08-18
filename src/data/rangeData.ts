import { RangeCategories, PokerRange } from '../types/rangeTypes';

export const rangeData: RangeCategories = {
  "open_raises": {
    "name": "Open Raises",
    "ranges": {
      "lj": {
        "name": "LJ (Lojack)",
        "range": {
          "raise": ["77", "88", "99", "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "QJs", "QTs", "Q9s", "JTs", "T9s", "AKo", "AQo", "AJo", "ATo", "KQo", "KJo", "QJo"]
        }
      },
      "hj": {
        "name": "HJ (Highjack)",
        "range": {
          "raise": ["66", "77", "88", "99", "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "QJs", "QTs", "Q9s", "Q8s", "JTs", "J9s", "T9s", "AKo", "AQo", "AJo", "ATo", "A9o", "KQo", "KJo", "QJo", "QTo", "KTo"]
        }
      },
      "co": {
        "name": "CO (Cutoff)",
        "range": {
          "raise": ["22", "33", "44", "55", "66", "77", "88", "99", "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "JTs", "J9s", "J8s", "J7s", "T9s", "T8s", "98s", "AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "KQo", "KJo", "QJo", "JTo", "QTo", "KTo", "K9o"]
        }
      },
      "btn": {
        "name": "BTN (Button) / SB (Small Blind)",
        "range": {
          "raise": ["22", "33", "44", "55", "66", "77", "88", "99", "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "T9s", "T8s", "T7s", "T6s", "98s", "97s", "96s", "87s", "86s", "76s", "75s", "65s", "54s", "AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "A7o", "A6o", "A5o", "A4o", "A3o", "KQo", "KJo", "QJo", "JTo", "QTo", "KTo", "T9o", "Q9o", "K9o", "K8o", "J9o"]
        }
      }
    }
  },
  "vs_lj": {
    "name": "vs. LJ",
    "ranges": {
      "hj_vs_lj": {
        "name": "HJ vs LJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "JJ", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "KQo"]
        }
      },
      "co_vs_lj": {
        "name": "CO vs LJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "KQo"]
        }
      },
      "btn_vs_lj": {
        "name": "BTN vs LJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "KQo"],
          "call": ["55", "66", "77", "88", "99", "98s", "87s", "76s", "65s", "54s", "44"]
        }
      },
      "sb_vs_lj": {
        "name": "SB vs LJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo"]
        }
      },
      "bb_vs_lj": {
        "name": "BB vs LJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "AKs", "AQs", "AJs", "ATs", "A5s", "A4s", "KQs", "KJs", "AKo", "KQo"],
          "call": ["22", "33", "44", "55", "66", "77", "88", "99", "JJ", "TT", "A9s", "A8s", "A7s", "A6s", "A3s", "A2s", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "JTs", "J9s", "J8s", "T9s", "T8s", "T7s", "98s", "97s", "96s", "87s", "86s", "76s", "75s", "65s", "64s", "54s", "53s", "43s", "AQo", "AJo", "ATo"]
        }
      }
    }
  },
  "vs_hj": {
    "name": "vs. HJ",
    "ranges": {
      "co_vs_hj": {
        "name": "CO vs HJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "AJo", "KQo"]
        }
      },
      "btn_vs_hj": {
        "name": "BTN vs HJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "AJo", "KQo"],
          "call": ["55", "66", "77", "88", "99", "98s", "87s", "76s"]
        }
      },
      "sb_vs_hj": {
        "name": "SB vs HJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "A9s", "A5s", "A4s", "KQs", "KJs", "KTs", "QJs", "AKo", "AQo", "AJo", "KQo"]
        }
      },
      "bb_vs_hj": {
        "name": "BB vs HJ",
        "range": {
          "raise": ["AA", "KK", "QQ", "JJ", "AKs", "AQs", "A6s", "A5s", "A4s", "A3s", "A2s", "K6s", "K5s", "K4s", "K3s", "K2s", "AKo", "KQo"],
          "call": ["22", "33", "44", "55", "66", "77", "88", "99", "TT", "AJs", "ATs", "A9s", "A8s", "A7s", "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "JTs", "J9s", "J8s", "T9s", "T8s", "T7s", "98s", "97s", "96s", "87s", "86s", "85s", "76s", "75s", "65s", "64s", "54s", "53s", "43s", "AQo", "AJo", "ATo", "KJo", "QJo"]
        }
      }
    }
  },
  "vs_co": {
    "name": "vs. CO",
    "ranges": {
      "btn_vs_co": {
        "name": "BTN vs CO",
        "range": {
          "raise": ["A9s", "ATs", "AJs", "AQs", "AKs", "AA", "A5s", "A4s", "K9s", "KTs", "KJs", "KQs", "KK", "AKo", "QTs", "QJs", "QQ", "KQo", "AQo", "JTs", "JJ", "QJo", "KJo", "AJo", "TT", "ATo"],
          "call": ["99", "98s", "88", "87s", "77", "76s"]
        }
      },
      "sb_vs_co": {
        "name": "SB vs CO",
        "range": {
          "raise": ["A9s", "ATs", "AJs", "AQs", "AKs", "AA", "A5s", "A4s", "A3s", "KTs", "KJs", "KQs", "KK", "AKo", "QTs", "QJs", "QQ", "KQo", "AQo", "KJo", "AJo", "JJ", "JTs", "TT", "99"]
        }
      },
      "bb_vs_co": {
        "name": "BB vs CO",
        "range": {
          "raise": ["AQs", "AKs", "AA", "KK", "QQ", "JJ", "AJo", "AQo", "AKo", "KQo", "A6s", "A5s", "A4s", "A3s", "A2s", "K2s", "K3s", "K4s", "K5s", "K6s"],
          "call": ["A7s", "A8s", "A9s", "ATs", "AJs", "K7s", "K8s", "KTs", "KJs", "KQs", "Q5s", "Q6s", "Q7s", "Q8s", "QTs", "QJs", "K9s", "Q9s", "J6s", "J7s", "J8s", "J9s", "JTs", "A9o", "ATo", "KTo", "KJo", "QTo", "QJo", "JTo", "TT", "99", "88", "77", "66", "55", "44", "33", "22", "98s", "T7s", "T8s", "T9s", "96s", "97s", "86s", "87s", "75s", "76s", "64s", "65s", "53s", "54s", "43s"]
        }
      }
    }
  },
  "vs_btn": {
    "name": "vs. BTN",
    "ranges": {
      "sb_vs_btn": {
        "name": "SB vs BTN",
        "range": {
          "raise": ["A3s", "A4s", "A5s", "A6s", "A7s", "A8s", "A9s", "ATs", "AJs", "AQs", "AKs", "AA", "K9s", "KTs", "KJs", "KQs", "KK", "AKo", "Q9s", "QTs", "QJs", "QQ", "KQo", "AQo", "KJo", "AJo", "ATo", "JJ", "JTs", "TT", "T9s", "99", "88", "77"]
        }
      },
      "bb_vs_btn": {
        "name": "BB vs BTN",
        "range": {
          "raise": ["A5s", "A4s", "ATs", "AJs", "AQs", "AKs", "AA", "K9s", "KTs", "KJs", "KQs", "KK", "AKo", "Q9s", "QTs", "QJs", "QQ", "KQo", "AQo", "J8s", "J9s", "JTs", "JJ", "T8s", "T9s", "TT", "99", "98s", "KJo", "AJo", "ATo"],
          "call": ["A9s", "A8s", "A7s", "A6s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "A3s", "A2s", "J4s", "J5s", "J6s", "J7s", "T6s", "T7s", "QJo", "QTo", "JTo", "J9o", "T9o", "K9o", "KTo", "A5o", "A6o", "A7o", "A8o", "A9o", "97s", "96s", "88", "87s", "86s", "85s", "77", "76s", "75s", "74s", "66", "65s", "64s", "55", "54s", "53s", "44", "43s", "33", "22"]
        }
      }
    }
  },
  "vs_sb": {
    "name": "vs. SB",
    "ranges": {
      "bb_vs_sb": {
        "name": "BB vs SB",
        "range": {
          "raise": ["ATs", "AJs", "AQs", "AKs", "AA", "A5s", "A4s", "KTs", "KJs", "KQs", "KK", "AKo", "QJs", "QQ", "AQo", "JJ", "TT", "Q8o", "K7o", "K6o", "K5o", "A7o", "A6o", "A5o", "A4o", "A3o", "A2o", "T5s", "T4s", "T3s", "T2s"],
          "call": ["A9s", "A8s", "A7s", "A6s", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s", "A2s", "A3s", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s", "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s", "T9s", "T8s", "T7s", "T6s", "99", "88", "77", "66", "55", "44", "33", "22", "K8o", "K9o", "KTo", "KJo", "KQo", "A8o", "A9o", "ATo", "AJo", "Q9o", "QTo", "QJo", "J9o", "JTo", "T8o", "T9o", "98s", "97s", "96s", "95s", "87s", "86s", "85s", "84s", "76s", "75s", "74s", "65s", "64s", "63s", "54s", "53s", "52s", "43s", "42s", "32s"]
        }
      }
    }
  },
  "facing_3bet": {
    "name": "Facing a 3-bet",
    "ranges": {
      "lj_vs_hj_3bet": {
        "name": "LJ vs HJ 3-bet",
        "range": {
          "raise": ["AKs", "AA", "KJs", "KQs", "KK", "AKo", "QQ", "JJ", "A5s", "A4s"],
          "call": ["ATs", "AJs", "AQs", "TT", "99", "88"]
        }
      },
      "lj_vs_co_3bet": {
        "name": "LJ vs CO 3-bet",
        "range": {
          "raise": ["AKs", "AA", "KTs", "KJs", "KQs", "KK", "AKo", "QQ", "JJ", "A5s", "A4s"],
          "call": ["TT", "99", "88", "ATs", "AJs", "AQs"]
        }
      },
      "lj_vs_btn_3bet": {
        "name": "LJ vs BTN 3-bet",
        "range": {
          "raise": ["AKs", "AA", "A5s", "A4s", "KTs", "KJs", "KQs", "KK", "AKo", "QQ", "JJ"],
          "call": ["ATs", "AJs", "AQs", "TT", "99", "88", "77"]
        }
      },
      "lj_vs_sb_3bet": {
        "name": "LJ vs SB 3-bet",
        "range": {
          "raise": ["AKs", "AA", "KQs", "KK", "AKo", "A5s", "A4s"],
          "call": ["ATs", "AJs", "AQs", "QQ", "JJ", "TT", "99", "88"]
        }
      },
      "lj_vs_bb_3bet": {
        "name": "LJ vs BB 3-bet",
        "range": {
          "raise": ["AKs", "AA", "AKo", "KK", "A5s", "A4s"],
          "call": ["ATs", "AJs", "AQs", "KJs", "KQs", "QJs", "QQ", "JJ", "TT", "99"]
        }
      },
      "hj_vs_co_3bet": {
        "name": "HJ vs CO 3-bet",
        "range": {
          "raise": ["A5s", "AKs", "AA", "KTs", "KJs", "KQs", "KK", "AKo", "QQ", "AQo", "JJ"],
          "call": ["ATs", "AJs", "AQs", "TT", "99", "88"]
        }
      },
      "hj_vs_sb_3bet": {
        "name": "HJ vs SB / BTN 3-bet",
        "range": {
          "raise": ["AKs", "AA", "KK", "QQ", "JJ", "AQo", "AKo", "KTs", "KJs", "KQs", "A5s"],
          "call": ["ATs", "AJs", "AQs", "TT", "99", "88", "77"]
        }
      },
      "hj_vs_bb_3bet": {
        "name": "HJ vs BB 3-bet",
        "range": {
          "raise": ["AKs", "AA", "AKo", "KK", "AQo", "A5s"],
          "call": ["ATs", "AJs", "AQs", "QQ", "KQs", "JJ", "TT", "99", "88", "77"]
        }
      },
      "co_vs_btn_3bet": {
        "name": "CO vs BTN 3-bet",
        "range": {
          "raise": ["ATo", "AJo", "AQo", "AKo", "AA", "KK", "AKs", "A5s", "QQ", "JJ", "JTs"],
          "call": ["ATs", "AJs", "AQs", "KTs", "KJs", "KQs", "TT", "T9s", "99", "98s", "88", "77"]
        }
      },
      "co_vs_sb_3bet": {
        "name": "CO vs SB 3-bet",
        "range": {
          "raise": ["A5s", "AKo", "AQo", "AA", "KK", "AKs", "ATs", "KTs", "QQ", "JJ", "TT"],
          "call": ["AJs", "KJs", "KQs", "AQs", "JTs", "99", "88", "77"]
        }
      },
      "co_vs_bb_3bet": {
        "name": "CO vs BB 3-bet",
        "range": {
          "raise": ["A5s", "KK", "AA", "AKs", "AKo", "AQo", "QQ", "JJ"],
          "call": ["A9s", "ATs", "AJs", "AQs", "KTs", "KJs", "KQs", "QJs", "JTs", "TT", "99", "88", "77"]
        }
      },
      "btn_vs_sb_3bet": {
        "name": "BTN vs SB 3-bet",
        "range": {
          "raise": ["AQs", "AKs", "AA", "AQo", "AKo", "KK", "QQ", "JJ", "TT", "A9s", "A8s", "A5s"],
          "call": ["ATs", "AJs", "KTs", "KQs", "KJs", "QTs", "QJs", "JTs", "T9s", "99", "98s", "88", "77"]
        }
      },
      "btn_vs_bb_3bet": {
        "name": "BTN vs BB 3-bet",
        "range": {
          "raise": ["AQs", "AKs", "AA", "KK", "AKo", "AQo", "QQ", "JJ", "TT", "A5s"],
          "call": ["A8s", "A9s", "ATs", "AJs", "K9s", "KTs", "KJs", "KQs", "QTs", "QJs", "JTs", "T9s", "99", "88", "77", "66", "55", "98s", "87s", "76s", "65s"]
        }
      },
      "sb_vs_bb_3bet": {
        "name": "SB vs BB 3-bet",
        "range": {
          "raise": ["A7s", "A6s", "A5s", "A4s", "AQs", "AKs", "AA", "ATo", "AJo", "AQo", "AKo", "KK", "QQ", "JJ", "TT"],
          "call": ["ATs", "AJs", "K9s", "KTs", "KJs", "KQs", "Q9s", "QTs", "QJs", "J9s", "JTs", "T9s", "99", "88", "77"]
        }
      }
    }
  },
  "facing_4bet": {
    "name": "Facing a 4-bet",
    "ranges": {
      "hj_vs_lj_4bet": {
        "name": "HJ / CO / SB / BTN vs LJ 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo"],
          "call": ["QQ", "JJ", "AQs", "KQs", "AJs"]
        }
      },
      "bb_vs_lj_4bet": {
        "name": "BB vs LJ 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo"],
          "call": ["QQ", "AQs"]
        }
      },
      "co_vs_hj_4bet": {
        "name": "CO vs HJ 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo"],
          "call": ["QQ", "JJ", "AQs", "KQs", "AJs", "KJs", "TT"]
        }
      },
      "sb_vs_hj_4bet": {
        "name": "SB / BTN vs HJ 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo", "QQ"],
          "call": ["JJ", "AQs", "KQs", "KJs", "AJs", "TT"]
        }
      },
      "bb_vs_hj_4bet": {
        "name": "BB vs HJ 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo", "QQ"],
          "call": ["JJ", "AQs"]
        }
      },
      "btn_vs_co_4bet": {
        "name": "BTN vs CO 4-bet",
        "range": {
          "raise": ["KK", "AKs", "AKo", "A5s", "QQ", "JJ"],
          "call": ["AQs", "KQs", "AA", "ATs", "AJs", "KTs", "KJs", "TT"]
        }
      },
      "sb_vs_co_4bet": {
        "name": "SB vs CO 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo", "QQ", "JJ", "TT", "A5s"],
          "call": ["AQs", "KQs", "99", "AJs"]
        }
      },
      "bb_vs_co_4bet": {
        "name": "BB vs CO 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo", "QQ", "JJ"],
          "call": ["AQs"]
        }
      },
      "sb_vs_btn_4bet": {
        "name": "SB vs BTN 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo", "A5s", "AQs", "AQo", "QQ", "JJ", "TT"],
          "call": ["KQs", "ATs", "AJs", "99", "88"]
        }
      },
      "bb_vs_btn_4bet": {
        "name": "BB vs BTN 4-bet",
        "range": {
          "raise": ["AA", "KK", "AKs", "AKo", "AQs", "A5s", "A4s", "QQ", "JJ", "TT"],
          "call": ["AJs", "KQs", "AQo", "99"]
        }
      },
      "bb_vs_sb_4bet": {
        "name": "BB vs SB 4-bet",
        "range": {
          "raise": ["KK", "AKs", "AKo", "A5s", "A4s", "QQ", "JJ", "AQo"],
          "call": ["AQs", "KQs", "AA", "AJs", "ATs", "KTs", "KJs", "QJs"]
        }
      }
    }
  },
  "facing_5bet_allin": {
    "name": "Facing an all-in 5-bet",
    "ranges": {
      "lj_vs_hj_5bet": {
        "name": "LJ vs HJ/CO/BTN/SB/BB and HJ vs BB",
        "range": {
          "call": ["AA", "KK", "AKs", "AKo"]
        }
      },
      "hj_vs_co_5bet": {
        "name": "HJ vs CO / SB BTN",
        "range": {
          "call": ["AA", "KK", "QQ", "AKs", "AKo"]
        }
      },
      "co_vs_sb_5bet": {
        "name": "CO vs SB",
        "range": {
          "call": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AKo"]
        }
      },
      "co_vs_bb_5bet": {
        "name": "CO vs BB/BTN and BTN vs BB",
        "range": {
          "call": ["AA", "KK", "QQ", "JJ", "AKs", "AKo"]
        }
      },
      "btn_vs_sb_5bet": {
        "name": "BTN vs SB",
        "range": {
          "call": ["AA", "KK", "QQ", "JJ", "AKs", "AQs", "AKo"]
        }
      },
      "sb_vs_bb_5bet": {
        "name": "SB vs BB",
        "range": {
          "call": ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AKo"]
        }
      }
    }
  }
};

// Helper function to get all available category IDs
export const getCategoryIds = (): string[] => {
  return Object.keys(rangeData);
};

// Helper function to get all available range IDs for a category
export const getRangeIds = (categoryId: string): string[] => {
  const category = rangeData[categoryId];
  return category ? Object.keys(category.ranges) : [];
};

// Helper function to get a specific range
export const getRange = (categoryId: string, rangeId: string) => {
  const category = rangeData[categoryId];
  if (!category) return null;
  
  const range = category.ranges[rangeId];
  return range || null;
};

// Helper function to get action for a hand from a range
export const getHandAction = (range: PokerRange, hand: string): string => {
  if (range.raise && range.raise.includes(hand)) return 'raise';
  if (range.call && range.call.includes(hand)) return 'call';
  return 'fold';
};

// Helper function to convert range to hand->action mapping
export const rangeToHandActionMap = (range: PokerRange): Record<string, string> => {
  const handActionMap: Record<string, string> = {};
  
  if (range.raise) {
    range.raise.forEach((hand: string) => {
      handActionMap[hand] = 'raise';
    });
  }
  
  if (range.call) {
    range.call.forEach((hand: string) => {
      handActionMap[hand] = 'call';
    });
  }
  
  return handActionMap;
};
