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

GLOBAL FILE * childOutput;
GLOBAL FILE * childInput;

GLOBAL struct io_t sio;
GLOBAL struct io_t *io=&sio;

bool io_get_line(io_t * io, char string[], int size) {

   int src, dst;
   int c;

   src = 0;
   dst = 0;

   while (true) {

      // test for end of buffer

      if (src >= io->in_size) {
         if (io->in_eof) {
            return true;
         } else {
         }
      }

      c = io->in_buffer[src++];

      if (c == LF) { // LF => line complete
         string[dst] = '\0';
         SYSLOG(LOG_WARNING, "--- io_get_line %s \n",string);
         break;
      } else if (c != CR) { // skip CRs
         string[dst++] = c;
      }
   }

   // shift the buffer

   io->in_size -= src;

   if (io->in_size > 0) memmove(&io->in_buffer[0],&io->in_buffer[src],io->in_size);

   // return

   return true;
}

static void my_write(int fd, const char string[], int size) {

   int n;
   do {

      n = write(fd,string,size);
      if (n == -1)
	  {
			SYSLOG(LOG_WARNING, "--- polyglot::my_write error %d \n",size);
            n = 0; // nothing has been written
			break;
      }
      string += n;
      size -= n;

   } while (size > 0);
}


bool io_get_update(io_t * io) {

   int pos, size;
   int n;
   int to=20;

   // init

   pos = io->in_size;
   size = BufferSize - pos;
   n = read(io->in_fd,&io->in_buffer[pos],size);
   if (n>0)
   {
	   io->in_size += n;
	   SYSLOG(LOG_WARNING, "read bytes %d in_size %d \n",n,io->in_size);
	   return(true);
   }
   else
   { // EOF
    io->in_eof = true;
	  return(false);
   }
}


void engine_send(const char *string)
{
   int len;

   SYSLOG(LOG_WARNING, "engine_send() in\n");
   len = strlen(string);
   memcpy(&io->out_buffer[io->out_size],string,len);
   io->out_size += len;
   io->out_buffer[io->out_size] = '\0';
   // io->out_buffer[io->out_size++] = CR;
   io->out_buffer[io->out_size++] = LF;

   my_write(io->out_fd,io->out_buffer,io->out_size);

   io->out_size = 0;
   SYSLOG(LOG_WARNING, "engine_send() <%s> out\n",string);
   // sleep(0.1);

}

bool engine_read(char *string,size_t StringSize,bool skip)
{
   memset(string,0,StringSize);
   bool data;
   io->in_eof=false;
   while ( true )
   {
	data=io_get_update(io);
	if (skip==SKIP)
	{
		io->in_size=0;
		break;
	}
	else
	{
		if (!io_get_line(io,string,StringSize))
		{
		 	return(false);
		}
 		else
  		{
			if (io->in_eof) break;
  		}
  	}
    }
    return(true);
	 
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

	pid_t pid;

	pid = fork();

	switch (pid)
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
			
			nice(-20);

			execvp(argv[0], &argv[0]);
		}
		break;

		case -1:
		break;

		default:		// parent
		{
			close(from_engine[1]);
			close(to_engine[0]);

			io->in_fd = from_engine[0];
			io->out_fd = to_engine[1];

			int flags = fcntl(io->in_fd, F_GETFL, 0);
			fcntl(io->in_fd, F_SETFL, flags | O_NONBLOCK);
			flags = fcntl(io->out_fd, F_GETFL, 0);
			fcntl(io->out_fd, F_SETFL, flags | O_NONBLOCK);
			
			nice(-5);

			io->name = "ENGINE";
			io->in_eof = false;
			io->in_size = 0;
			io->out_size = 0;
		}
		break;
    }
}




