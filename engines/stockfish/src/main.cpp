/*
  Stockfish, a UCI chess playing engine derived from Glaurung 2.1
  Copyright (C) 2004-2008 Tord Romstad (Glaurung author)
  Copyright (C) 2008-2009 Marco Costalba

  Stockfish is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Stockfish is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// To profile with callgrind uncomment following line
//#define USE_CALLGRIND


////
//// Includes
////

#include <iostream>
#include <string>

#include "bitcount.h"
#include "misc.h"
#include "uci.h"

#ifdef USE_CALLGRIND
#include <valgrind/callgrind.h>
#endif

using namespace std;


////
//// Functions
////

int main(int argc, char *argv[]) {
  
  // Disable IO buffering
  cout.rdbuf()->pubsetbuf(NULL, 0);
  cin.rdbuf()->pubsetbuf(NULL, 0);

  // Initialization through global resources manager
  Application::initialize();

#ifdef USE_CALLGRIND
  CALLGRIND_START_INSTRUMENTATION;
#endif

  // Process command line arguments if any
  if (argc > 1)
  {
      if (string(argv[1]) != "bench" || argc < 4 || argc > 8)
          cout << "Usage: stockfish bench <hash size> <threads> "
               << "[time = 60s] [fen positions file = default] "
               << "[time, depth, perft or node limited = time] "
               << "[timing file name = none]" << endl;
      else
      {
          string time = argc > 4 ? argv[4] : "60";
          string fen = argc > 5 ? argv[5] : "default";
          string lim = argc > 6 ? argv[6] : "time";
          string tim = argc > 7 ? argv[7] : "";
          // benchmark(string(argv[2]) + " " + string(argv[3]) + " " + time + " " + fen + " " + lim + " " + tim);
      }
      return 0;
  }

#ifdef SHOWINFO
  // Print copyright notice
  cout << engine_name()
       << ". By Tord Romstad, Marco Costalba, Joona Kiiski." << endl;

  if (CpuHasPOPCNT)
      cout << "Good! CPU has hardware POPCNT. We will use it." << endl;
#endif
  // Enter UCI mode
  uci_main_loop();
  return 0;
}
