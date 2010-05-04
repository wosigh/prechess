#include <cstdio>
#include <cstdlib>
#include <unistd.h>
#include <signal.h>
#include <fcntl.h>
#include <syslog.h>
#include <string.h>
#include "polyglot.h"
#include "PDL.h"
#include "SDL.h"

GLOBAL char result[200];
GLOBAL char fenstring[250];
GLOBAL bool bcalculatecommand=false;
GLOBAL bool bcalculatefinished=false;

GLOBAL bool blookforcommand=false;
GLOBAL bool blookforfinished=false;
GLOBAL bool bstop=false;
GLOBAL bool binitucicommand=false;
GLOBAL bool binitucifinished=false;

GLOBAL bool mydebug=true;
	
bool init()
{
   char iniLine[132];
   FILE * iniFile;
   const char * command=iniLine;
   // SYSLOG(LOG_WARNING, "--- polyglot::init() 11 --- \n");
   iniFile = fopen ("/media/cryptofs/apps/usr/palm/applications/com.vocshopgames.chess/polyglot.ini","r");
   if (iniFile!=NULL)
   {
		// SYSLOG(LOG_WARNING, "--- polyglot::init() 22 --- \n");
		fgets(iniLine,80,iniFile);
		// SYSLOG(LOG_WARNING, "--- polyglot::init() 33 --- \n");   
		for (int i=0;i<132;i++) iniLine[i]=(iniLine[i]==0x0D?0x0A:iniLine[i]);
		// SYSLOG(LOG_WARNING, "--- polyglot::init() 44 --- \n");   
		popen(command);
		// SYSLOG(LOG_WARNING, "--- polyglot::init() 55 --- \n");   
	}
	else
	{
		// SYSLOG(LOG_WARNING, "--- polyglot::init() 66 --- \n"); 
	}
}

PDL_bool plugin_calculate(PDL_MojoParameters* params) 
{
	if (PDL_GetNumMojoParams(params) < 1 )
	{
		PDL_MojoException(params, "You must send a value from 0 to 100");
		return PDL_TRUE;
	}
	const char *myfenstring = PDL_GetMojoParamString(params, 0);

	
	SYSLOG(LOG_WARNING, "--- plugin_calculate --- %s\n",fenstring);
	strcpy(fenstring,myfenstring);
	
	//calculate(fenstring);
	bcalculatecommand=true;
	bcalculatefinished=false;
	return PDL_TRUE;
}


PDL_bool plugin_stop(PDL_MojoParameters* params) 
{
	SYSLOG(LOG_WARNING, "--- plugin_stop --- \n");
	//stop(result);
	bstop=true;
	//lookfor(result);
	blookforcommand=true;
	blookforfinished=false;	
	return PDL_TRUE;
}


PDL_bool plugin_result(PDL_MojoParameters* params) 
{
	PDL_MojoReply(params,result);
	SYSLOG(LOG_WARNING, "--- plugin_result --- \n");
	binitucicommand=true;	
	return PDL_TRUE;
}



PDL_bool plugin_status(PDL_MojoParameters* params) 
{
	char res[4];
	if (binitucifinished)
	{
		res[0]='y';
		
	}	
	else
	{
		res[0]='n';		
	}
		
	if (bcalculatefinished)
	{
		res[1]='y';
		
	}	
	else
	{
		res[1]='n';
	}	
	
	if (blookforfinished)
	{
		res[2]='y';
		
	}	
	else
	{
		res[2]='n';
	}
	
	SYSLOG(LOG_WARNING, "--- status %s\n",res);
	
	PDL_MojoReply(params,res);
		
	return PDL_TRUE;
}




// functions

int main(int argc, char** argv) {

   openlog("polyglot", LOG_PID, LOG_USER);
   SYSLOG(LOG_WARNING, "--- polyglot::main() \n");
   SYSLOG(LOG_WARNING, "--- polyglot::main() %s %s",__DATE__,__TIME__);
      
    // Initialize the SDL library with the Video subsystem
    SDL_Init(SDL_INIT_VIDEO);


	// register the Mojo callbacks
	PDL_RegisterMojoHandler("plugin_calculate", plugin_calculate);
	PDL_RegisterMojoHandler("plugin_stop", plugin_stop);
	PDL_RegisterMojoHandler("plugin_result", plugin_result);
	PDL_RegisterMojoHandler("plugin_status", plugin_status);
	
	
	// finish registration and start the callback handling thread
	PDL_MojoRegistrationComplete();

   init();
   binitucifinished=false;
   inituci();
   binitucifinished=true;   
   
   int timer=0;
   
   SDL_Event Event;
    do {
    	
    	// sleep(0.1);  
    		
    	if (bcalculatecommand && binitucifinished)
    	{
    	   result[0]=0;	
		   calculate(fenstring);
		   bcalculatecommand=false;	   
		}
		
		if (bstop && binitucifinished)
		{
		   stop(result);
		   bstop=false;	  
		}
	
		if (blookforcommand)
		{		
		   lookfor(result);
		   blookforfinished=true;
		   blookforcommand=false;	   
		}
		
		if (binitucicommand)
		{
			binitucifinished=false;
	   		inituci();
	    	binitucifinished=true;   
	    	binitucicommand=false;
	    }
	    	
		
    	// Process the events
        while (SDL_PollEvent(&Event)) 
        {
                	
		switch (Event.type) 
		{
	               // List of keys that have been pressed
	                case SDL_KEYDOWN:
	                    switch (Event.key.keysym.sym) 
	                    {
	                     // Escape forces us to quit the app
	                        case SDLK_ESCAPE:
	                            Event.type = SDL_QUIT;
	                            break;
	
	                        default:
	                            break;
	                    }
	                    break;
	
	                default:
	                break;
	         }
	     } // do

    } while (Event.type != SDL_QUIT);

   PDL_Quit();
   SDL_Quit();
   SYSLOG(LOG_WARNING, "--- polyglot::main exit() \n");
   closelog();
   return 0;
}
