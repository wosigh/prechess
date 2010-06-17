/*
  Stockfish, a UCI chess playing engine derived from Glaurung 2.1
  Copyright (C) 2004-2008 Tord Romstad (Glaurung author)
  Copyright (C) 2008-2010 Marco Costalba, Joona Kiiski, Tord Romstad

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
#include "sys/shm.h"
#include "syslog.h"
#include <signal.h>
#include <string.h>
#include <cstdio>


#include "PDL.h"
#include "SDL.h"

#define SYSLOG(a...) 

#ifdef USE_CALLGRIND
#include <valgrind/callgrind.h>
#endif

int shmidin; 
int shmidout;
int shmidheartbeat;

char *shmin=0;
char *shmout=0;
char *shmheartbeat=0;
int  ppid=0;

using namespace std;


////
//// Functions
////

void signalhandler(int sig)
{
	SYSLOG(LOG_WARNING, "stockfish SIGABORT \n");
}

int main(int argc, char *argv[]) {

	ppid=getppid();
	SYSLOG(LOG_WARNING, "--- stockfish::ppid() %d\n",ppid);
	
	signal(SIGABRT,signalhandler);

	

	shmidin  = shmget(ppid*10+1, 128, 0666 | IPC_CREAT );
	shmidout = shmget(ppid*10, 128, 0666 | IPC_CREAT  );
	shmidheartbeat = shmget(ppid*10+20, 128, 0666 | IPC_CREAT );
	
	
	if (shmidin!=-1)
	{
		shmin = (char *) shmat( shmidin, NULL, 0666 | IPC_CREAT );
	}
	else
	{
		SYSLOG(LOG_WARNING, "--- stockfish::shmidin() \n");
	
		return(0);
	}
	
	if (shmidout!=-1)
	{
		SYSLOG(LOG_WARNING, "--- stockfish::shmidout() \n");
	
		shmout = (char *) shmat( shmidout, NULL, 0666 | IPC_CREAT );
	}
	else
	{
		return(0);
	}
	
	if (shmidheartbeat!=-1)
	{
		SYSLOG(LOG_WARNING, "--- stockfish::shmidheartbeat() \n");
	
		shmheartbeat = (char *) shmat( shmidheartbeat, NULL, 0666 | IPC_CREAT );
	}
	else
	{
		return(0);
	}
	
	if (shmout==0 || shmin==0 || shmheartbeat==0) 
	{
			return(0);
  }
  
  	memset(shmin,0,128);
	memset(shmout,0,128);
	memset(shmheartbeat,0,128);
  
	SYSLOG(LOG_WARNING, "--- stockfish::before initialize() \n");
	

	
  // Disable IO buffering
  cout.rdbuf()->pubsetbuf(NULL, 0);
  cin.rdbuf()->pubsetbuf(NULL, 0);

  // Initialization through global resources manager
  Application::initialize();

	SYSLOG(LOG_WARNING, "--- stockfish::after initialize() \n");


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
  SYSLOG(LOG_WARNING, "--- stockfish::before uci_main_loop \n");

  uci_main_loop();
  
  SYSLOG(LOG_WARNING, "--- stockfish::after uci_main_loop \n");

  return 0;
}
