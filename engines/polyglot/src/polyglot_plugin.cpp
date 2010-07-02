#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <unistd.h>
#include <signal.h>
#include <fcntl.h>
#include <syslog.h>
#include <string.h>
#include <wait.h>
#include <signal.h>

#include "polyglot.h"
#include "PDL.h"
#include "SDL.h"
#include "sys/shm.h"

GLOBAL char gacResult[200];
GLOBAL char gacFenstring[250];
	
GLOBAL bool gbCalculateCommand=false;
GLOBAL bool gbCalculateFinished=false;


GLOBAL bool gbLookforCommand=false;
GLOBAL bool gbLookforFinished=false;
GLOBAL bool gbStop=false;
GLOBAL bool gbInitUCICommand=false;
GLOBAL bool gbInitUCIFinshed=false;

GLOBAL bool mydebug=true;


	
bool init()
{
   char iniLine[132];
   FILE * iniFile;
   const char * command=iniLine;
   SYSLOG(LOG_WARNING, "--- polyglot::init() 11 --- \n");
   iniFile = fopen ("/media/cryptofs/apps/usr/palm/applications/com.vocshopgames.chess/polyglot.ini","r");
   if (iniFile!=NULL)
   {
		SYSLOG(LOG_WARNING, "--- polyglot::init() 22 --- \n");
		fgets(iniLine,80,iniFile);
		SYSLOG(LOG_WARNING, "--- polyglot::init() 33 --- \n");   
		for (int i=0;i<132;i++) iniLine[i]=(iniLine[i]==0x0D?0x0A:iniLine[i]);
		SYSLOG(LOG_WARNING, "--- polyglot::init() 44 --- \n");   
		popen(command);
		SYSLOG(LOG_WARNING, "--- polyglot::init() 55 --- \n");   
	}
	else
	{
		SYSLOG(LOG_WARNING, "--- polyglot::init() 66 --- \n"); 
	}
}

PDL_bool plugin_calculate(PDL_JSParameters* params) 
{
	if (PDL_GetNumJSParams(params) < 1 )
	{
		PDL_JSException(params, "You must send a value from 0 to 100");
		return PDL_TRUE;
	}
	const char *myfenstring = PDL_GetJSParamString(params, 0);

	
	SYSLOG(LOG_WARNING, "--- plugin_calculate --- %s\n",gacFenstring);
	strcpy(gacFenstring,myfenstring);
	
	//calculate(fenstring);
	gbCalculateCommand=true;
	gbCalculateFinished=false;
	return PDL_TRUE;
}



PDL_bool plugin_stop(PDL_JSParameters* params) 
{
	SYSLOG(LOG_WARNING, "--- plugin_stop --- \n");
	//stop(result);
	gbStop=true;
	//lookfor(result);
	gbLookforCommand=true;
	gbLookforFinished=false;	
	return PDL_TRUE;
}


PDL_bool plugin_result(PDL_JSParameters* params) 
{
	PDL_JSReply(params,gacResult);
	SYSLOG(LOG_WARNING, "--- plugin_result --- \n");
	gbInitUCICommand=true;	
	return PDL_TRUE;
}



PDL_bool plugin_status(PDL_JSParameters* params) 
{
	char res[4];
	if (gbInitUCIFinshed)
	{
		res[0]='y';
		
	}	
	else
	{
		res[0]='n';		
	}
		
	if (gbCalculateFinished)
	{
		res[1]='y';
		
	}	
	else
	{
		res[1]='n';
	}	
	
	if (gbLookforFinished)
	{
		res[2]='y';
		
	}	
	else
	{
		res[2]='n';
	}
	
	PDL_JSReply(params,res);
		
	return PDL_TRUE;
}


PDL_bool plugin_info(PDL_JSParameters* params) 
{
	PDL_JSReply(params,&shmheartbeat[2]);
	SYSLOG(LOG_WARNING, "--- plugin_info --- \n");
	return PDL_TRUE;
}



void mySDL_Quit()
{
	SYSLOG(LOG_WARNING, "--- mySDL_QUIT --- \n");
	SDL_Quit();
}


void myPDL_Quit()
{
	if (childpid > 0) 
	{   
		if(kill(childpid,SIGINT)) 
		{   
			SYSLOG(LOG_WARNING, "--- engine not killed --- \n");
		}        
		
		waitpid(childpid,0,0);  
		SYSLOG(LOG_WARNING, "--- after waitpid --- \n");
	}
	
	SYSLOG(LOG_WARNING, "--- myPDL_QUIT --- \n");
	PDL_Quit();
}

void signalhandler(int sig)
{
	syslog(LOG_WARNING, "polyglot SIGABRT \n");
}

// functions



void sighandler ( int signum )  
{  
   SYSLOG(LOG_WARNING, "--- polyglot::signal() %d \n",signum);
}  


int main(int argc, char** argv) {

	
	for (int i=0;i<32;i++) signal(i,signalhandler);

   openlog("polyglot", LOG_PID, LOG_USER);
   SYSLOG(LOG_WARNING, "--- polyglot::main() \n");
   int pid=getpid();
   SYSLOG(LOG_WARNING, "--- polyglot::pid() %d\n",pid);
  
	shmidin = shmget(pid*10, 128, 0666 | IPC_CREAT );
	shmidout = shmget(pid*10+1, 128, 0666 | IPC_CREAT );
	shmidheartbeat = shmget(pid*10+20, 128, 0666 | IPC_CREAT );
	
	
	
	if (shmidin!=-1)
	{
		shmin = (char *) shmat( shmidin, NULL, 0666 | IPC_CREAT );
	}
	else
	{
		return(0);
	}
	
	if (shmidout!=-1)
	{
		shmout = (char *) shmat( shmidout, NULL, 0666 | IPC_CREAT );
	}
	else
	{
		return(0);
	}
	
	
	if (shmidheartbeat!=-1)
	{
		shmheartbeat = (char *) shmat( shmidheartbeat, NULL, 0666 | IPC_CREAT );
	}
	else
	{
		return(0);
	}
	
	if (shmout==0 || shmin==0 || shmheartbeat==0) 
	{
		SYSLOG(LOG_WARNING, "--- polyglot::assert() %s %s",__DATE__,__TIME__);
   	return(0);
  }
  
    memset(shmin,0,128);
	memset(shmout,0,128);
	memset(shmheartbeat,0,128);
	
   SYSLOG(LOG_WARNING, "--- polyglot::main() %s %s",__DATE__,__TIME__);
      
    // Initialize the SDL library with the Video subsystem
    SDL_Init(SDL_INIT_VIDEO);
    atexit(mySDL_Quit);
    PDL_Init(0);
    atexit(myPDL_Quit);
    

	// register the JS callbacks
	PDL_RegisterJSHandler("plugin_calculate", plugin_calculate);
	PDL_RegisterJSHandler("plugin_stop", plugin_stop);
	PDL_RegisterJSHandler("plugin_result", plugin_result);
	PDL_RegisterJSHandler("plugin_status", plugin_status);
	PDL_RegisterJSHandler("plugin_info", plugin_info);
		
	// finish registration and start the callback handling thread
	PDL_JSRegistrationComplete();

   init();
   gbInitUCIFinshed=false;
   SYSLOG(LOG_WARNING, "--- polyglot before inituci");
   inituci();
   SYSLOG(LOG_WARNING, "--- polyglot after inituci");
   gbInitUCIFinshed=true;   
   
   int timer=0;
   
   static long cnt=3000000;
     
   SYSLOG(LOG_WARNING, "--- polyglot after inituci 11");
   
        
   SDL_Event Event;
    do {
  
   		 // let the operating system do other things
    	 if ((SDL_GetAppState() & ~SDL_APPACTIVE) == 0) 
    	 {
    	 	SDL_Delay(1000);
    	 }
    	 else
    	 {
    	 	SDL_Delay(1);
    	 }   
    		
    	if (gbCalculateCommand && gbInitUCIFinshed)
    	{
  	 		SYSLOG(LOG_WARNING, "--- polyglot after inituci 33");
  
    	   gacResult[0]=0;	
		   calculate(gacFenstring);
		   gbCalculateCommand=false;	   
		}
		
		if (gbStop && gbInitUCIFinshed)
		{
			
		   stop(gacResult);
		   gbStop=false;	  
		}
	
		if (gbLookforCommand && shmout[0]==0)
		{	
	 		SYSLOG(LOG_WARNING, "--- polyglot after inituci 44");
  	
		   lookfor(gacResult);
		   gbLookforFinished=true;
		   gbLookforCommand=false;	   
		}
		
		if (gbInitUCICommand && shmout[0]==0 )
		{
			gbInitUCIFinshed=false;
			SYSLOG(LOG_WARNING, "--- polyglot before2 inituci");
  	   		inituci();
	   		SYSLOG(LOG_WARNING, "--- polyglot after2 inituci");
   
	   		
	    	gbInitUCIFinshed=true;   
	    	gbInitUCICommand=false;
	    }
	    
		
    	// Process the events
        while (SDL_PollEvent(&Event)) 
        {
        	SYSLOG(LOG_WARNING, "--- polyglot after inituci 33");
   	
                	
					switch (Event.type) 
					{
	               // List of keys that have been pressed
	                case SDL_KEYDOWN:
	                    switch (Event.key.keysym.sym) 
	                    {
	                     // Escape forces us to quit the app
	                        case SDLK_ESCAPE:
	                           	syslog(LOG_WARNING, "--- polyglot::escape \n");
   
	                            Event.type = SDL_QUIT;
	                            break;
	
	                        default:
	                        	  syslog(LOG_WARNING, "--- polyglot::default1 \n");
   
	                            break;
	                    }
	                    break;
	
	                default:
	                	  syslog(LOG_WARNING, "--- polyglot::default%d \n",Event.type);
   
	                break;
	         }
	     } // do

    } while (Event.type != SDL_QUIT);
	 syslog(LOG_WARNING, "--- by \n");
   

   // PDL_Quit();
   // SDL_Quit();
   // closelog();
   shmdt(shmin);
   shmdt(shmout);
   
   return (EXIT_SUCCESS);
}
