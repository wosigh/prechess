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

bool skip_answer(char *string,int StringSize)
{
   	
		if (engine_read(string,StringSize,SKIP))
		{				
				return (true);
		}
		else
		{
				return(false);
		}
}

bool wait_answer(char *string,int StringSize,const char *answer,int size)
{
   for (int i=0 ; i<500000 ; i++ )
   {
	        sleep(0.1);
		if (engine_read(string,StringSize,NOSKIP))
		{
			if (!memcmp(string,answer,size))
			{
				SYSLOG(LOG_WARNING, "-- wait answer --- good %d <%s>\n",i,string);
				return(true);
			}
			else
			{
				// SYSLOG(LOG_WARNING, "-- wait answer --- bad %d <%s>\n",i,string);				
			}
		}
		else
		{
			SYSLOG(LOG_WARNING, "-- wait answer --- bad2 %d <%s>\n",i,string);				
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
   engine_send("ucinewgame");   
    
   // ISREADY
   SYSLOG(LOG_WARNING, " inituci \n");
   engine_send("isready");  
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
    
   engine_send("go infinite");
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
   SYSLOG(LOG_WARNING, "--- lookfor --- \n");   
   wait_answer(string,StringSize,"bestmove",8);      
   SYSLOG(LOG_WARNING, "--- polyglot::lookfor() 1. bestmove \n");
   //sleep(2);
   //wait_answer(string,StringSize,"bestmove",8);   
   //SYSLOG(LOG_WARNING, "--- polyglot::calculate() 2. bestmove \n");
   
   return(0);
}

