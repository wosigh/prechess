/*
  Glaurung, a UCI chess playing engine.
  Copyright (C) 2004-2008 Tord Romstad

  Glaurung is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  Glaurung is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


#if !defined(SEARCH_H_INCLUDED)
#define SEARCH_H_INCLUDED

////
//// Includes
////

#include "depth.h"
#include "history.h"
#include "lock.h"
#include "movegen.h"
#include "position.h"
#include "tt.h"
#include "value.h"


////
//// Constants
////

const int PLY_MAX = 100;
const int PLY_MAX_PLUS_2 = 102;


////
//// Types
////

/// The SearchStack struct keeps track of the information we need to remember
/// from nodes shallower and deeper in the tree during the search.  Each
/// search thread has its own array of SearchStack objects, indexed by the
/// current ply.

struct SearchStack {
  Move pv[PLY_MAX];
  Move currentMove;
  Value currentMoveCaptureValue;
  Move mateKiller, killer1, killer2;
  Move threatMove;
  Depth reduction;
};


////
//// Global variables
////

extern TranspositionTable TT;

extern int ActiveThreads;

extern Lock SMPLock;

// Perhaps better to make H local, and pass as parameter to MovePicker?
extern History H;  


////
//// Prototypes
////

extern void init_threads();
extern void stop_threads();
extern void think(const Position &pos, bool infinite, bool ponder, int time,
                  int increment, int movesToGo, int maxDepth, int maxNodes,
                  int maxTime, Move searchMoves[]);
extern int64_t nodes_searched();


#endif // !defined(SEARCH_H_INCLUDED)
