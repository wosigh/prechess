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
#include "sys/shm.h"

GLOBAL FILE * childOutput;
GLOBAL FILE * childInput;

GLOBAL struct io_t sio;
GLOBAL struct io_t *io=&sio; 

GLOBAL int shmidin;
GLOBAL int shmidout;
GLOBAL int shmidheartbeat;
GLOBAL char *shmin;
GLOBAL char *shmout;
GLOBAL char *shmheartbeat;
GLOBAL pid_t childpid;

void engine_send(const char *string)
{
   	SYSLOG(LOG_WARNING, "-- send <%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c>\n",
				string[0],string[1],string[2],string[3],string[4],string[5],string[6],string[7],
				string[8],string[9],string[10],string[11],string[12],string[13],string[14],string[15],
				string[16],string[17],string[18],string[19],string[20],string[21],string[22],string[23],
				string[24],string[25],string[26],string[27],string[28],string[29],string[30],string[31]);
    while(shmout[0]!=0)
    {   		
    	sleep(0.01);
    }
   	sprintf(shmout,"%s",string);
   	SYSLOG(LOG_WARNING, "send ");
}

bool engine_read(char *string,size_t StringSize,bool skip)
{
   	while (shmout[0]!=0)
   	{
   		sleep(0.01);
   	}
   	if(shmin[0]!=0)
   	{
   		sprintf(string,"%s%d",shmin,'\0');		
   	}   			   	
   	
}




void popen(const char *command) {
	int from_engine[2];
	int to_engine[2];
	int argc=0;
	char *pc=(char *)command;
	char *argv[20];
	char *ptr;

	SYSLOG(LOG_WARNING, "popen() %s\n",command);

	for (ptr = strtok(pc," "); ptr != NULL; ptr = strtok(NULL," "))
	{
	  for (int j=0;*(ptr+j)!=0;j++)
	  {
		if (*(ptr+j) == '\n' ) *(ptr+j) = 0 ;
	  }
      argv[argc++] = ptr;
    }
	argv[argc] = NULL;

    pipe(from_engine);
	pipe(to_engine);

	childpid = fork();

	switch (childpid)
	{
		case 0:	  // child
		{
			close(from_engine[0]);
			close(to_engine[1]);

			dup2(to_engine[0],STDIN_FILENO);
			close(to_engine[0]);

			dup2(from_engine[1],STDOUT_FILENO);
			close(from_engine[1]);

			dup2(STDOUT_FILENO,STDERR_FILENO);
			
			//nice(-10);

			execvp(argv[0], &argv[0]);
		}
		break;

		case -1:
		break;

		default:		// parent
		{
		  //signal ( SIGINT, sighandler ) ;

	    //signal ( SIGQUIT, sighandler1 ) ;

      //signal ( SIGTERM, sighandler2 ) ;


			close(from_engine[1]);
			close(to_engine[0]);

			io->in_fd = from_engine[0];
			io->out_fd = to_engine[1];

			int flags = fcntl(io->in_fd, F_GETFL, 0);
			fcntl(io->in_fd, F_SETFL, flags | O_NONBLOCK);
			flags = fcntl(io->out_fd, F_GETFL, 0);
			fcntl(io->out_fd, F_SETFL, flags | O_NONBLOCK);
			
			//nice(-1);

			io->name = "ENGINE";
			io->in_eof = false;
			io->in_size = 0;
			io->out_size = 0;
		}
		break;
    }
}
 