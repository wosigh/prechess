
function bestmove2board()
{
	Mojo.Log.error("bestmove2board "+vv.sBestMove);
	var b_old2= [];
	b_old2=vv.aBoard.clone();
    
	var za="h";
	var offset=1+za.charCodeAt(0);	
	var type=0;
	x1=offset-vv.sBestMove.charCodeAt(9);
	y1=vv.sBestMove.charAt(10);
	
	vv.sLastMove=vv.sBestMove.charAt(9)+vv.sBestMove.charAt(10)+vv.sBestMove.charAt(11)+vv.sBestMove.charAt(12);
	st("");
	x2=offset-vv.sBestMove.charCodeAt(11);
	y2=vv.sBestMove.charAt(12);
	
	source=(x1-1)+(y1-1)*8;
	dest=(x2-1)+(y2-1)*8;
    source=63-source;
    dest=63-dest;	
    
	ps=vv.aBoard[source]|0x20;
	to=vv.aBoard[dest];
	movetoright=(x2>x1);
	blackgroundline=(dest<8);
	straightcolumn=(x1==x2);
	straightline=(y1==y2);
	diagonal=(x1!=x2);
	
	if ((ps==166 || ps==102 ) && Math.abs(dest-source)>1 && straightline)  type=1;
	if ((ps==97  || ps==161) && diagonal && (vv.aBoard[dest]==0 || vv.aBoard[dest]=='undefined' ))      type=2;
	if ((ps==97  || ps==161) && (y2==1 || y2==8))    type=3;
    
	switch (type)
	{
		case 1: // -1- castling
			vv.aBoard[dest]=ps;
			if (blackgroundline) ad=vv.cWHITE_FIG ; else ad=0; 				
			if (movetoright)
			{
				if (blackgroundline)
				{
					vv.aBoard[source-4]=0;
					vv.aBoard[dest+1]=100+ad; // move rook
				}
				else
				{
					vv.aBoard[dest+1]=100+ad; // move rook
					vv.aBoard[source-4]=0; // remove rook
				}
			}
			else
			{
				if (blackgroundline)
				{
					vv.aBoard[source+3]=0;  // remove rook
					vv.aBoard[source+1]=100+ad; // move rook
				}
				else
				{
					vv.aBoard[dest-1]=100+ad; // move rook
					vv.aBoard[source+3]=0; // remove rook
				}	
		}
		vv.aBoard[source]=0; // remove king
		break;
		
		case 2: // -2- en passent
			vv.aBoard[dest]=ps;
			vv.aBoard[source]=0;
			if (!straightline)
			{
				vv.aBoard[source+(movetoright?-1:1)]=0;	// remove pawn
			}
		break;
		
		case 3: // -3- promotion always queen
		   if (blackgroundline) ad=vv.cWHITE_FIG ; else ad=0; 				
			vv.aBoard[dest]=165-ad;
			vv.aBoard[source]=0;
		break;
		
		default:
			vv.aBoard[dest]=ps;
			vv.aBoard[source]=0;
		break;
	}
	
	delta_calc(b_old2,vv.aBoard);
	redo_remove();
	
	Mojo.Log.error("bestmove2board 11 PlayWhte %d c=%d ",PreChess.PlayWhte,vv.iColor);
	Mojo.Log.error("bestmove2board 11 %d c=%d ",PreChess.PlayBlck,vv.iColor);
	
	
	nx(true);
	dxxx(vv.aBoard);	
	
    vv.iAction = 0;    
	vv.iMoves = vv.iMoves + 1;	
	vv.iRunning=0;
	
	vv.that.SaveGame();
		
	Mojo.Log.error("bestmove2board 22 PlayWhte %d c=%d ",PreChess.PlayWhte,vv.iColor);
	Mojo.Log.error("bestmove2board 22 %d c=%d ",PreChess.PlayBlck,vv.iColor);	
	
}

function smfen() {
	K = "";
	K += "position fen ";
	var castlebq = true ;
	var castlebk = true ;
	var castlewQ = true ;
	var castlewK = true ;
	for (var y = 0; y <8 ; ++y) 
	{
		var spaces=0;
		for (var x = 0; x < 8; ++x) 
		{
			var f = vv.aBoard[x + y * 8];
			if (!f) f=1;
			var fig='';
			var isspace=0;
			switch (f)
			{					
				// white non moved
				case  65: fig='P'; break;
				case  66: fig='N'; break;
				case  67: fig='B'; break;
				case  68: fig='R'; break;
				case  69: fig='Q'; break;
				case  70: fig='K'; 
                break;						
				
				// white moved
				case  97: fig='P'; break;
				case  98: fig='N'; break;
				case  99: fig='B'; break;
				case 100: 
						fig='R';
						if (vv.aBoard[56]!=68)
						{
							castlewQ=false;
						}
						if (vv.aBoard[63]!=68)
						{
							castlewK=false;
						}
						break;									
				case 101: fig='Q'; break;
				case 102: fig='K';
						castlewQ=false;
						castlewK=false;
						break;					
			
				// non moved
				case 129: fig='p'; break;
				case 130: fig='n'; break;
				case 131: fig='b'; break;
				case 132: fig='r'; break;
				case 133: fig='q'; break;
				case 134: fig='k'; 
				break;
				
				// moved
				case 161: fig='p'; break;
				case 162: fig='n'; break;
				case 163: fig='b'; break;
				case 164: fig='r';							
						if (vv.aBoard[0]!=132) castlebq=false;						
						if (vv.aBoard[7]!=132) castlebk=false;						
						break;
				case 165: fig='q'; break;
				case 166: fig='k';
						castlebq=castlebk=false;
						break;												
				default:
					isspace=1;
					spaces = spaces + 1;		
				break;
			}			
			
			if (!isspace)
			{
				if (spaces > 0 )
				{			
					K += spaces;
					spaces=0;
				}
				K += fig ;			
			}
		} // for x
		if (spaces>0)
		{
			K += spaces;
		}	
		if (y!=7) K += "/";
	}

	if (vv.iColor==vv.cWHITE_FIG) K += " w ";
	if (vv.iColor!=vv.cWHITE_FIG) K += " b ";
	if (castlewK) K +="K";
	if (castlewQ) K +="Q";
	if (castlebk) K +="k";
	if (castlebq) K +="q";
	if (!castlebk && !castlebq  && !castlewK && !castlewQ)
		K +="-";
	
	K += " ";
	K += "0 ";		// 50 moves rule
	K += vv.iMoves;
	K += "\n";
	st(K);
	return (K);
}

