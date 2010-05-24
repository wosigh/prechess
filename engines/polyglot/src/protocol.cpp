#include <cstdio>
#include <cstdlib>
#include <unistd.h>
#include <signal.h>
#include <fcntl.h>
#include <syslog.h>
#include <string.h>
#include "PDL.h"
#include "SDL.h"
#include "polyglot.h"


bool wait_answer(char *string,int StringSize,const char *answer,int size)
{
   for (int i=0 ; i<500000 ; i++ )
   {
	        sleep(0.1);
		if (engine_read(string,StringSize,NOSKIP))
		{
			if (!memcmp(string,answer,size))
			{
				SYSLOG(LOG_WARNING, "-- wait answer --- good %d <%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c>\n",i,
				string[0],string[1],string[2],string[3],string[4],string[5],string[6],string[7],
				string[8],string[9],string[10],string[11],string[12],string[13],string[14],string[15],
				string[16],string[17],string[18],string[19],string[20],string[21],string[22],string[23],
				string[24],string[25],string[26],string[27],string[28],string[29],string[30],string[31]);
				return(true);
			}
			else
			{
			
				// SYSLOG(LOG_WARNING, "-- wait answer --- bad %d <%s>\n",i,string);				
			}
		}
		else
		{
			SYSLOG(LOG_WARNING, "-- wait answer --- bad %d <%c%c%c%c%c%c%c%c>\n",i,
				string[0],string[1],string[2],string[3],string[4],string[5],string[6],string[7]);				
		}
	}
	SYSLOG(LOG_WARNING, "xx wait answer xx exit \n");
	return(false);
}


int inituci()
{
   char string[StringSize];
   
   // Version String   
   // skip_answer(string,StringSize);
   
   // UCINEWGAME   
   engine_send("ucinewgame\n");   
    
   // ISREADY
   SYSLOG(LOG_WARNING, " inituci \n");
   engine_send("isready\n");  
   wait_answer(string,StringSize,"readyok",7);
 
}


int calculate(const char *pos)
{
   char string[StringSize];
  
   
   // POSITION
   engine_send(pos);   
   // skip_answer(string,StringSize);
      
   // GO INFINITE
   SYSLOG(LOG_WARNING, " go infinite \n");
    
   engine_send("go infinite\n");
   // skip_answer(string,StringSize);
   
   // wait_answer(string,StringSize,"go",2);   
   
   return(0);
}


int stop(char *string)
{
      
   // STOP   
   engine_send("stop");   
   // skip_answer(string,StringSize);  
   SYSLOG(LOG_WARNING, "--- stop before lookfor --- \n");
   return(0);
}


int lookfor(char *string)
{
      
   // STOP
   // skip_answer(string,StringSize);   
   SYSLOG(LOG_WARNING,"%c%c",shmin[0],shmin[1]);   
   
   SYSLOG(LOG_WARNING, "--- lookfor --- \n");   
   wait_answer(string,StringSize,"bestmove",8);      
   SYSLOG(LOG_WARNING, "--- polyglot::lookfor() 1. bestmove \n");
   //sleep(2);
   //wait_answer(string,StringSize,"bestmove",8);   
   //SYSLOG(LOG_WARNING, "--- polyglot::calculate() 2. bestmove \n");
   
   return(0);
}

