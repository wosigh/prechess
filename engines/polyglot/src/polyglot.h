#define GLOBAL
#define EINTR           4
#define EPIPE           32
#define SKIP   (1)
#define NOSKIP (0)

extern bool mydebug;

#define SYSLOG(a...) void( (false) ? syslog(a) : void() )

extern int  calculate(const char *);
extern int  stop(char *);
extern int  lookfor(char *);
extern int  inituci();
extern void popen(const char *);
extern bool engine_read(char *,size_t,bool);
extern void engine_send(const char *);
extern int shmidin;
extern int shmidout;
extern int shmidheartbeat;

extern char* shmin;
extern char* shmout;
extern char* shmheartbeat;

extern pid_t childpid;

const int StringSize = 4096;
const int BufferSize = 16384;
const int CR = 0x0D;
const int LF = 0x0A;

#define OPENING_BOOK "/media/cryptofs/apps/usr/palm/applications/com.vocshopgames.chess/preferences_scene.png" 

struct io_t {

   int in_fd;
   int out_fd;

   const char * name;

   bool in_eof;

   int in_size;
   int out_size;

   char in_buffer[BufferSize];
   char out_buffer[BufferSize];
}; 
