var bestmove;
var running=0;
var mymoves;
var b;
var deltas = [];
var delta_cnts = [];
var status="nnn";
var fenstring;
var setTimeValue=1000;
var loopTimer;
var last;
var engineplaywhite=false;
var engineplayblack=false;

var WHITE_FIG=64;
var BLACK_FIG=128;
var CHANGE_COLOR=192;


 function GameAssistant() {
    /* this is the creator function for your scene assistant object. It will be passed all the
      additional parameters (after the scene name) that were passed to pushScene. The reference
      to the scene controller (this.controller) has not be established yet, so any initialization
      that needs the scene controller should be done in the setup function below. */
}
GameAssistant.prototype.setup = function () {
    /* this function is for setup tasks that have to happen when the scene is first created */
    /* use Mojo.View.render to render view templates and add them to the scene, if needed. */
    /* setup widgets here */
    /* add event handlers to listen to events from widgets */
	

	
    this.controller.setupWidget(Mojo.Menu.appMenu, {
        omitDefaultItems: true
    },
    this.appMenuModel);
    this.appMenuModel = {
        visible: true,
        items: [ //	{ label: $L('Custom 1'), command: 'cmd-Cust1' },
        //Mojo.Menu.editItem,
        //	{ label: $L('Custom 2'), command: 'cmd-Cust2' },
        {
            label: "About",
            command: 'do-myPrefs'
        },
        {
            label: "Help...",
            command: 'do-myHelp'
        }]
    }; // Setup toggle widget and an observer for when it is changed
    this.whitetoggle = {
        trueLabel: '1',
        //if the state is true, what to label the toggleButton; default is 'On'
        trueValue:  '1' ,//if the state is true, what to set the model[property] to; default if not specified is true
        falseLabel: '0',
        //if the state is false, what to label the toggleButton; default is Off
        falseValue: '0', //if the state is false, , what to set the model[property] to; default if not specific is false],
        fieldName: 'PlayWhite' //name of the field; optional
    }
    this.blacktoggle = {
        trueLabel: '1',
        //if the state is true, what to label the toggleButton; default is 'On'
        trueValue:  '1' ,//if the state is true, what to set the model[property] to; default if not specified is true
        falseLabel: '0',
        //if the state is false, what to label the toggleButton; default is Off
        falseValue: 'false', //if the state is false, , what to set the model[property] to; default if not specific is false],
        fieldName: 'PlayBlack' //name of the field; optional
    }
    this.tModel = {
        value: false,
        // Current value of widget, from choices array.
        disabled: false //whether or not the checkbox value can be changed; if true, this cannot be changed; default is false			
    }
    this.fModel = {
        value: false,
        // Current value of widget, from choices array.
        disabled: false //whether or not the checkbox value can be changed; if true, this cannot be changed; default is false	
    }
    this.controller.setupWidget('BackButton', this.backbutton, {label: $L('Back')});
    this.controller.setupWidget('PlayWhite', this.whitetoggle, this.fModel);
    this.controller.setupWidget('PlayBlack', this.blacktoggle, this.tModel);
    Mojo.Event.listen(this.controller.get('PlayWhite'), Mojo.Event.propertyChange, this.whitetogglePressed.bindAsEventListener(this));
    Mojo.Event.listen(this.controller.get('PlayBlack'), Mojo.Event.propertyChange, this.blacktogglePressed.bindAsEventListener(this)); //Mojo.Event.listen(this.controller.get('Button'),Mojo.Event.tap,this.buttonPressed.bindAsEventListener(this));
    Mojo.Event.listen(this.controller.get('BackButton'), Mojo.Event.tap, this.backbutton.bind(this));

    this.pattributes = {
        choices: [{
            label: " fast",
            value: 1
        },
        {
            label: " 5sec",
            value: 2
        },
        {
            label: "10sec",
            value: 3
        },
        {
            label: " infi",
            value: 4
        }]
    };
    this.pmodel = {
        value: ' 5sec',
        disabled: false
    };
    this.controller.setupWidget("setTime", this.pattributes, this.pmodel); // Observe mojo-property-change events on our selector widgets:
    this.controller.listen('setTime', Mojo.Event.propertyChange, this.selectorChanged.bindAsEventListener(this));
    var attributes = {
        hintText: 'hint',
        textFieldName: 'name',
        modelProperty: 'original',
        multiline: false,
        disabledProperty: 'disabled',
        focus: true,
        modifierState: Mojo.Widget.capsLock,
        //autoResize: 	automatically grow or shrink the textbox horizontally,
        //autoResizeMax:	how large horizontally it can get
        //enterSubmits:	when used in conjunction with multline, if this is set, then enter will submit rather than newline
        limitResize: false,
        holdToEnable: false,
        focusMode: Mojo.Widget.focusSelectMode,
        changeOnKeyPress: true,
        textReplacement: false,
        maxLength: 30,
        requiresEnterKey: false
    };
    this.model = {
        'original': 'initial value',
        disabled: false
    };
    this.controller.setupWidget('textField', attributes, this.model);
    Mojo.Log.error('ported apps setup'); //Globals for chess program
    pimg = new Array();
    i = new Array("b", "bb1", "bb2", "bb3", "bb4", "bb5", "bb6", "bw1", "bw2", "bw3", "bw4", "bw5", "bw6", "l", "r", "sbb1", "sbb2", "sbb3", "sbb4", "sbb5", "sbb6", "sbw1", "sbw2", "sbw3", "sbw4", "sbw5", "sbw6", "swb1", "swb2", "swb3", "swb4", "swb5", "swb6", "sww1", "sww2", "sww3", "sww4", "sww5", "sww6", "t", "u", "w", "wb1", "wb2", "wb3", "wb4", "wb5", "wb6", "ww1", "ww2", "ww3", "ww4", "ww5", "ww6");
    for (j = 0; j < i.length; ++j) {
        pimg[j] = new Image();
        pimg[j].src = "images/" + i[j] + ".png";
    }
    N = 1;			// move no
    K = "";
    F = 0;			// 0 human to play 1 computer to play 
    px = 0;			// x-pos click
    py = 0;			// y-pos click
    mymoves = 0;
	l();	
	Mojo.Log.error('end of setup');
};

function plugin_calculate() {
	var resp=$('polyglot').plugin_calculate(fenstring);	
}

function  plugin_stop() {
    $('polyglot').plugin_stop();	
    // plugin_status();	
}

function  plugin_result() {
    plugin_status();
	if (status.charAt(2)!="y")	// lookfor
	{
		// Mojo.Log.error("add for look for");
		loopTimer=setTimeout("plugin_result()",500);
	}
	else
	{
		Mojo.Log.error("fine");		
		bestmove=$('polyglot').plugin_result();               
    	bestmove2board();                  
    	clearTimeout(loopTimer);
	}
}



function  plugin_status() {
	status=$('polyglot').plugin_status();    	
	// Mojo.Log.error(status.charAt(0)+status.charAt(1)+status.charAt(2));
}



GameAssistant.prototype.selectorChanged = function (event) {
    Mojo.Log.error(event.value);
    if (event.value==1)
    {
    	setTimeValue=0;
    }
    if (event.value==2)
    {
    	setTimeValue=3000;
    }
    if (event.value==3)
    {
    	setTimeValue=8000;
    }
    
    if (event.value==4)
    {
    	setTimeValue=8000;
    }
    	
}
GameAssistant.prototype.whitetogglePressed = function (event) { //Display the value of the toggle
    if (event.value=="1")
    {
    	
    	engineplaywhite=true;
        pw(event.value);
    }
    else
    {
    	engineplaywhite=false;
    }
    
};
GameAssistant.prototype.blacktogglePressed = function (event) { //Display the value of the toggle
    if (event.value=="1")
    {
    	engineplayblack=true;
    	pb(event.value);    	
    }
    else
    {
    	engineplayblack=false;
    }	
};

GameAssistant.prototype.backbutton = function (event) {
    Mojo.Log.error("back");
    
    this.tModel.value=this.fModel.falseValue;
    this.fModel.value=this.fModel.falseValue;
	this.controller.modelChanged(this.tModel);
	this.controller.modelChanged(this.fModel);
	engineplaywite=engineplayblack=false;    
    
    if (delta_cnts.length > 0 )
    {
	    var delta_cnt = delta_cnts.pop();
	    var delta = deltas.pop();
	    for (var d=0;d<delta_cnt*2;d=d+2)
	    {
	    	b[delta[d]]=delta[d+1];    	
	    }	    
	    mymoves= mymoves-1 ;
	    dxxx(b);
	    last = !last;
	    F=0;
	    c = c ^ CHANGE_COLOR ;
	}
};


GameAssistant.prototype.handleCommand = function (event) {
    this.controller = Mojo.Controller.stageController.activeScene();
    if (event.type == Mojo.Event.command) {
        switch (event.command) { // these are built-in commands. we haven't enabled any of them, but
            // they are listed here as part of the boilerplate, to be enabled later if needed
        case 'do-myPrefs':
            this.controller.showAlertDialog({
                title:
                $L("About PreChess"),
                message: $L("PreChess is a direct port of Niel Pearce's Javascript chess. Castling, en-passent and pawn promotion are all catered for, but the rule 'Game is drawn if a position repeats three times' is not implemented. The CPU performs an alpha-beta search to a depth of two moves, but does not examine check at the deepest level."),
                choices: [{
                    label: $L('OK'),
                    value: "refresh",
                    type: 'affirmative'
                }]
            });
            break; // another built-in menu item, but we've enabled it (see below in this method)
            // so now we have to handle it:
        case 'do-myHelp':
            this.controller.stageController.assistant.showScene('help', 'help');
            break;
        }
    }
}
GameAssistant.prototype.activate = function (event) {
    /* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
    l();
};
GameAssistant.prototype.deactivate = function (event) {
    /* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};
GameAssistant.prototype.cleanup = function (event) {
    /* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};

// showmoves
function sm(i) {
	Mojo.Log.error("function sm in");
    if (N > 200) return;
    var j = "abcdefgh";
    if (N & 1) {
        if (N < 19) K += " ";
        K += (1 + N >> 1) + ". ";
    } else K += "   ";
    if (i.f == 3) K += "o-o  ";
    else if (i.f == 5) K += "o-o-o";
    else K += j.charAt(i.x) + (8 - i.y) + " " + j.charAt(i.X) + (8 - i.Y);
    if (++N & 1) K += "XX\n";
    // $($L("gameLog")).innerHTML = "<pre>" + K + "</pre>"; //if (! ((N - 1) % 20)) K = "";
    Mojo.Log.error("function sm out");
}

function bestmove2board()
{
    //0123456789012
    //bestmove f3g5
    // Mojo.Log.error("bestmove2board%s",bestmove);
    
    var b_old2= [];
    b_old2=b.clone();
    
    var za="h";
	var offset=1+za.charCodeAt(0);	
	var type=0;
	x1=offset-bestmove.charCodeAt(9);
	y1=bestmove.charAt(10);
	
	x2=offset-bestmove.charCodeAt(11);
	y2=bestmove.charAt(12);
	
	source=(x1-1)+(y1-1)*8;
	dest=(x2-1)+(y2-1)*8;
    source=63-source;
    dest=63-dest;	
	ps=b[source];
	movetoright=(x2>x1);
	blackgroundline=(dest<8);
	straightcolumn=(x1==x2);
	straightline=(y1==y2);
	diagonal=(x1!=x2);
	
	if ((ps==70 || ps==134) && Math.abs(dest-source)>1 && straightline)  type=1;
	if ((ps==97 || ps==161) && diagonal)              type=2;
	if ((ps==97 || ps==161) && (y2==0 || y2==7))    type=3;

    
	switch (type)
	{
		case 1: // -1- castling
			b[dest]=ps;
			if (blackgroundline) ad=WHITE_FIG ; else ad=0; 				
			if (movetoright)
			{
				if (blackgroundline)
				{
					b[source+3]=0;
					b[source+1]=100+ad; // move rook
				}
				else
				{
					b[dest+1]=100+ad; // move rook
					b[source-4]=0; // remove rook
				}
			}
			else
			{
				if (blackgroundline)
				{
					b[source+3]=0;  // remove rook
					b[source+1]=100+ad; // move rook
				}
				else
				{
					b[dest-1]=100+ad; // move rook
					b[source+3]=0; // remove rook
				}	
				
			}
			
			b[source]=0; // remove king
			
		break;
		
		case 2: // -2- en passent
			b[dest]=ps;
			b[source]=0;
			if (!straightline)
			{
				b[source+(movetoright?-1:1)]=0;	// remove pawn
			}
		break;
		
		case 3: // -3- promotion always queen
		   if (blackgroundline) ad=WHITE_FIG ; else ad=0; 				
			
			b[dest]=165-ad;
			b[source]=0;
		break;
		
		default:
			b[dest]=ps;
			b[source]=0;
		break;
	}
	
	delta_calc(b_old2,b);
	
	// nx();
	dxxx(b);
	c ^= CHANGE_COLOR;
    F = 0;    
	mymoves = mymoves + 1;
	running=0;
	st("#:" + mymoves + " "+ bestmove );
}

function smfen(b,c,mymoves) {
	K = "";
	K += "position fen ";
	var castlebq = 1 ;
	var castlebk = 1 ;
	var castlewQ = 1 ;
	var castlewK = 1 ;
	for (var y = 0; y <8 ; ++y) 
	{
		var spaces=0;
		for (var x = 0; x < 8; ++x) 
		{
			var f = b[x + y * 8];
			if (!f)
			{
				f=1;
			}
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
				case  70: fig='K'; break;						
				
				// white moved
				case  97: fig='P'; break;
				case  98: fig='N'; break;
				case  99: fig='B'; break;
				case 100: 
						fig='R';
						if (b[56]!=68)
						{
							castlewQ=0;
						}
						if (b[63]!=68)
						{
							castlewK=0;
						}
						break;									
				case 101: fig='Q'; break;
				case 102: fig='K';
						castlewQ=0;
						castlewK=0;
						break;					
			
				// non moved
				case 129: fig='p'; break;
				case 130: fig='n'; break;
				case 131: fig='b'; break;
				case 132: fig='r'; break;
				case 133: fig='q'; break;
				case 134: fig='k'; break;
				
				// moved
				case 161: fig='p'; break;
				case 162: fig='n'; break;
				case 163: fig='b'; break;
				case 164: fig='r';							
						if (b[0]!=132)
						{
							castlebq=0;
						}
						if (b[7]!=132)
						{
							castlebk=0;
						}
						break;
				case 165: fig='q'; break;
				case 166: fig='k';
						castlebq=0;
						castlebk=0;
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

	Mojo.Log.error("c=%d WHITE_FIG=%d ",c,WHITE_FIG);	
	if (c==WHITE_FIG)
	{
		Mojo.Log.error(" w ");	
		K += " w ";
	}
	else
	{
		Mojo.Log.error(" b ");	
		K += " b ";
	}
	
	if (castlewK)
	{		
		K +="K";
	}
	if (castlewQ)
	{
		K +="Q";
	}
	if (castlebk)
	{
		K +="k";
	}
	if (castlebq)
	{
		K +="q";
	}
	if (!castlebk && !castlebq  && !castlewK && !castlewQ)
	{
		K +="-";
	}
	
	K += " ";
	K += "0";		// 50 moves rule
	K += mymoves;
	K += "\n";
	// $($L("gameLog")).innerHTML = "<pre>" + K + "</pre>"; //if (! ((N - 1) % 20)) K = "";
	return (K);
	
}


function un(u, b) {
    for (var i = u.x.length - 1; i >= 0; --i) Z(b, u.x[i], u.y[i], u.p[i]);
}


function au(u, b, x, y) {
    u.x.push(x);
    u.y.push(y);
    u.p.push(b[x + y * 8]);
}
function st(x) {
    $($L("gametime")).innerHTML = x;
}
function P(x, y, X, Y, f) {
    this.x = x;
    this.y = y;
    this.X = X;
    this.Y = Y;
    this.f = f;
}
function U() {
    this.x = [];
    this.y = [];
    this.p = [];
}

// empty
function em(b, x, y) {
    return ! b[x + y * 8];
}

// iswhite
function ge(b, x, y) {
    return b[x + y * 8] & 7;
}


function co(b, x, y) {
    return b[x + y * 8] & CHANGE_COLOR;
}

// is figure with right color
function sa(b, x, y, c) {
    var i = b[x + y * 8];
    return i && (i & c);
}


function op(b, x, y, c) {
    var i = b[x + y * 8];
    return i && !(i & c);
}

// already moved 
function mo(b, x, y) {
    var i = b[x + y * 8];
    return i && (i & 32);
}


function la(b, x, y) {
    var i = b[x + y * 8];
    return i && (i & 16);
}


function ra(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}


function di(c) {
    return c == WHITE_FIG ? -1 : 1;
}

// 
function Z(b, x, y, p) {
    b[x + y * 8] = p;
    return b;
}

function t(b, x, y, i, j, c, l) {
    var X = x;
    var Y = y;
    while (ra(X += i, Y += j) && em(b, X, Y)) l.push(new P(x, y, X, Y, 0));
    if (ra(X, Y) && op(b, X, Y, c)) l.push(new P(x, y, X, Y, 0));
    return l;
}

// rook
function ro(b, x, y, c, l) {
    t(b, x, y, 1, 0, c, t(b, x, y, -1, 0, c, t(b, x, y, 0, 1, c, t(b, x, y, 0, -1, c, l))));
}

// bishop
function bi(b, x, y, c, l) {
    t(b, x, y, 1, 1, c, t(b, x, y, -1, -1, c, t(b, x, y, 1, -1, c, t(b, x, y, -1, 1, c, l))));
}


// king
function ki(b, x, y, c, l) {
    for (var i = -1; i < 2; ++i) for (var j = -1; j < 2; ++j) {
        var X = x + i;
        var Y = y + j;
        if ((X || Y) && ra(X, Y) && !sa(b, X, Y, c)) l.push(new P(x, y, X, Y, 0));
    }
    if (!mo(b, x, y)) if (em(b, 5, y) && em(b, 6, y) && !em(b, 7, y) && !mo(b, 7, y)) {
        var u = new U();
        au(u, b, x, y);
        Z(b, x, y, 0);
        var i = fi(b, c ^ CHANGE_COLOR);
        var j = 0;
        var X = -1;
        while (!j && ++X != i.length) j = i[X].Y == y && i[X].X == 5;
        if (!j) l.push(new P(x, y, 6, y, 3));
        un(u, b);
    } else if (em(b, 3, y) && em(b, 2, y) && em(b, 1, y) && !em(b, 0, y) && !mo(b, 0, y)) {
        var u = new U();
        au(u, b, x, y);
        Z(b, x, y, 0);
        var i = fi(b, c ^ CHANGE_COLOR);
        var j = 0;
        var X = -1;
        while (!j && ++X != i.length) j = i[X].Y == y && i[X].X == 3;
        if (!j) l.push(new P(x, y, 2, y, 5));
        un(u, b);
    }
}

// knight
function kn(b, x, y, c, l) {
    for (var i = -2; i < 3; ++i) for (var j = -2; j < 3; ++j) if (Math.abs(i) + Math.abs(j) == 3) {
        var X = x + i;
        var Y = y + j;
        if (ra(X, Y) && !sa(b, X, Y, c)) l.push(new P(x, y, X, Y, 0));
    }
}

// pawn
function pa(b, x, y, c, l) {
    var Y = y + di(c);
    var Z = y + di(c) * 2;
    if (!mo(b, x, y) && em(b, x, Y) && em(b, x, Z)) l.push(new P(x, y, x, Z, 2));
    if (em(b, x, Y)) {
        if (!Y || Y == 7) l.push(new P(x, y, x, Y, 4));
        else l.push(new P(x, y, x, Y, 0));
    }
    for (var i = -1; i < 2; i += 2) {
        var X = x + i;
        if (ra(X, Y)) {
            if (op(b, X, Y, c)) {
                if (!Y || Y == 7) l.push(new P(x, y, X, Y, 4));
                else l.push(new P(x, y, X, Y, 0));
            } else if (em(b, X, Y) && la(b, X, Y - di(c))) l.push(new P(x, y, X, Y, 1));
        }
    }
}

// draw
function d(b) {
    for (var y = 0; y < 8; ++y) for (var x = 0; x < 8; ++x) {
        var i = "<img src=\"images/";
        if (F == 1 && x == px && y == py) i += "s";
        i += (x + y & 1) ? "b": "w";
        if (!em(b, x, y)) i += (sa(b, x, y, WHITE_FIG) ? "w": "b") + (ge(b, x, y) & 7);
        document.getElementById("" + x + y).innerHTML = i + ".png\">";
    }
}


function dxxx(b) {
    for (var y = 0; y < 8; ++y) for (var x = 0; x < 8; ++x) {
        var i = "<img src=\"images/";
        i += (x + y & 1) ? "b": "w";
        if (!em(b, x, y)) i += (sa(b, x, y, WHITE_FIG) ? "w": "b") + (ge(b, x, y) & 7);
        document.getElementById("" + x + y).innerHTML = i + ".png\">";
    }
}




function ma(b, m) {
	Mojo.Log.error("function ma in");
    u = new U();
    for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) if (la(b, x, y)) {
        au(u, b, x, y);
        Z(b, x, y, ge(b, x, y) | co(b, x, y) | mo(b, x, y));
    }
    au(u, b, m.X, m.Y);
    if (m.f == 4) Z(b, m.X, m.Y, 37 | co(b, m.x, m.y));
    else Z(b, m.X, m.Y, ge(b, m.x, m.y) | co(b, m.x, m.y) | 32 | (m.f == 2 ? 16 : 0));
    au(u, b, m.x, m.y);
    Z(b, m.x, m.y, 0);
    if (m.f == 1) {
        au(u, b, m.X, m.Y - di(c));
        Z(b, m.X, m.Y - di(c), 0);
    } else if (m.f == 3) {
        au(u, b, 5, m.y);
        au(u, b, 7, m.y);
        Z(Z(b, 5, m.y, ge(b, 7, m.y) | co(b, 7, m.y) | 32), 7, m.y, 0);
    } else if (m.f == 5) {
        au(u, b, 3, m.y);
        au(u, b, 0, m.y);
        Z(Z(b, 3, m.y, ge(b, 0, m.y) | co(b, 0, m.y) | 32), 0, m.y, 0);
    }
    Mojo.Log.error("function ma out");    
    return u;
}

// figur
function fi(b, c) {
    var l = [];
    for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) if (sa(b, x, y, c)) {
        var i = ge(b, x, y);
        if (i == 1) pa(b, x, y, c, l);
        else if (i == 2) kn(b, x, y, c, l);
        else if (i == 3) bi(b, x, y, c, l);
        else if (i == 4) ro(b, x, y, c, l);
        else if (i == 5) {
            bi(b, x, y, c, l);
            ro(b, x, y, c, l)
        } else if (i == 6) ki(b, x, y, c, l);
    }
    for (var i = 0; i < l.length / 3; ++i) {
        var j = Math.floor(Math.random() * l.length);
        var k = Math.floor(Math.random() * l.length);
        var x = l[j];
        l[j] = l[k];
        l[k] = x;
    }
    return l;
}


var Sp = [0, 60, 370, 370, 450, 1000, 5000];
var Sb = [[0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 0, 0, 4, 3, 2, 4, 6, 12, 12, 12, 4, 6, 4, 4, 7, 18, 25, 25, 16, 7, 4, 6, 11, 18, 27, 27, 16, 11, 6, 10, 15, 24, 32, 32, 24, 15, 10, 10, 15, 24, 32, 32, 24, 15, 10, 0, 0, 0, 0, 0, 0, 0, 0], [ - 7, -3, 1, 3, 3, 1, -3, -7, 2, 6, 14, 20, 20, 14, 6, 2, 6, 14, 22, 26, 26, 22, 14, 6, 8, 18, 26, 30, 30, 26, 18, 8, 8, 18, 30, 32, 32, 30, 18, 8, 6, 14, 28, 32, 32, 28, 14, 6, 2, 6, 14, 20, 20, 14, 6, 2, -7, -3, 1, 3, 3, 1, -3, -7], [16, 16, 16, 16, 16, 16, 16, 16, 26, 29, 31, 31, 31, 31, 29, 26, 26, 28, 32, 32, 32, 32, 28, 26, 16, 26, 32, 32, 32, 32, 26, 16, 16, 26, 32, 32, 32, 32, 26, 16, 16, 28, 32, 32, 32, 32, 28, 16, 16, 29, 31, 31, 31, 31, 29, 16, 16, 16, 16, 16, 16, 16, 16, 16], [0, 0, 0, 3, 3, 0, 0, 0, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0], [ - 2, -2, -2, 0, 0, -2, -2, -2, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0], [3, 3, 8, -12, -8, -12, 10, 5, 0, 0, -5, -5, -12, -12, -12, -12, -5, -5, -7, -15, -15, -15, -15, -15, -15, -7, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20], []];
for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) Sb[6][x + y * 8] = Sb[5][(7 - x) + y * 8];
function sc(b, c) {
    var s = 0;
    for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) {
        var i = ge(b, x, y);
        if (i) if (sa(b, x, y, BLACK_FIG)) s += Sb[i == 6 ? 6 : i - 1][(7 - x) + y * 8] + Sp[i];
        else s -= Sb[i - 1][x + (7 - y) * 8] + Sp[i];
    }
    return c == BLACK_FIG ? s: -s;
}
function cpu(white) {
	Mojo.Log.error("function cpu in");
    
    //sm(bm);
	if (running==0)
	{
	    // ma(b, bm);
	    running=1;
  		fenstring=smfen(b,c,mymoves)
		//plugin_status();
		
		setTimeout("plugin_calculate()",0);								
		setTimeout("plugin_stop()",setTimeValue);		
		setTimeout("plugin_result()",setTimeValue+1000);		    
	}		
	Mojo.Log.error("function cpu out");
    
}

// playwhite
function pw(e) {
	Mojo.Log.error("function pw in");
    Mojo.Log.error("pw engineplaywhite %d c=%d  F=%d",engineplaywhite,c,F);
    Mojo.Log.error("pb engineplayblack %d c=%d  F=%d",engineplayblack,c,F);   
    
    if (F < 2 && c == WHITE_FIG && engineplaywhite) {
        F = 2;
        setTimeout("cpu(true)", 800);
		
    }
   
    Mojo.Log.error("function pw out");
    
    
}

// playback
function pb(e) {
    
    Mojo.Log.error("function pb in");
    Mojo.Log.error("pw engineplaywhite %d c=%d  F=%d",engineplaywhite,c,F);
    Mojo.Log.error("pb engineplayblack %d c=%d  F=%d",engineplayblack,c,F);   
        
    if (F < 2 && c == BLACK_FIG && engineplayblack) {
        F = 2;
             
        setTimeout("cpu(false)", 800);
    }
    
    Mojo.Log.error("function pb out");
    
}
function l(update) {
    Mojo.Log.error("function l in");
    if (!update)
    {
    	b = [];
    }
    for (i = 0; i < 8; ++i) Z(Z(b, i, 6, 65), i, 1, 129);
    d(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(b, 0, 0, 132), 1, 0, 130), 2, 0, 131), 3, 0, 133), 4, 0, 134), 5, 0, 131), 6, 0, 130), 7, 0, 132), 0, 7, 68), 1, 7, 66), 2, 7, 67), 3, 7, 69), 4, 7, 70), 5, 7, 67), 6, 7, 66), 7, 7, 68));
    c = WHITE_FIG;
    Mojo.Log.error("function l out");
}

function hu(x, y) {
	Mojo.Log.error("function hu in");
    var b_old1=[];
    
    b_old1=b.clone();
                
    if (F == 0) {
        if (sa(b, x, y, c)) {
            px = x;
            py = y;
            F = 1;
            d(b);
        }
    } else if (F == 1) {
        if (x == px && y == py) {
            F = 0;
            d(b);
            return;
        }
        var m = fi(b, c);
        for (var i = 0; i < m.length; ++i) {
            if (m[i].x == px && m[i].y == py && m[i].X == x && m[i].Y == y && ge(b, x, y) != 6) {
                var u = ma(b, m[i]);
                var o = fi(b, c ^ CHANGE_COLOR);
                for (var j = 0; j < o.length; ++j) if (ge(b, o[j].X, o[j].Y) == 6 && sa(b, o[j].X, o[j].Y, c)) {
                    un(u, b);
                    st("Invalid move");
                    return;
                }
                //sm(m[i]);
				//smfen(b,2,99);
				delta_calc(b_old1,b);
				nx();
                return;
            }
        }
        st("Invalid move");
    }
    Mojo.Log.error("function hu out");
}

function delta_calc(b_old,b_new)
{
	var delta = [];
	var delta_cnt;
	Mojo.Log.error("delta_calc %d %d",b_old.length,b_new.length );
	delta_cnt=0;
	for (var x=0;x<8;x++)
    {
    	for (var y=0;y<8;y++)
    	{
    		if (b_old[x+y*8]!= b_new[x+y*8])
    		{
    			
    			delta[delta_cnt]= x+y*8;
    			Mojo.Log.error("pos--%d",x+y*8);
    			delta[delta_cnt+1]= b_old[x+y*8] ;
    			Mojo.Log.error("val old--%d",b_old[x+y*8]);
    			Mojo.Log.error("val new--%d",b_new[x+y*8]);
    			
    			delta_cnt ++ ;
    			delta_cnt ++ ;
    		}
    	}	
    }
    
    deltas.push(delta);
    delta_cnts.push(delta_cnt);
}

function nx(redraw) {
    Mojo.Log.error("function nx in");
    c ^= CHANGE_COLOR;
    F = 0;
    d(b);
    for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) if (ge(b, x, y) == 6 && sa(b, x, y, c)) {
        var kx = x;
        var ky = y;
    }
    var m = fi(b, c ^ CHANGE_COLOR);
    var ic = 0;
    for (var i = 0; i < m.length; ++i) if (m[i].X == kx && m[i].Y == ky) ic = 1;
    var m = fi(b, c);
    var cm = 1;
    for (var i = 0; i < m.length; ++i) {
        var u = ma(b, m[i]);
        for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) if (ge(b, x, y) == 6 && sa(b, x, y, c)) {
            var kx = x;
            var ky = y;
        }
        var om = fi(b, c ^ CHANGE_COLOR);
        un(u, b);
        var hm = 0;
        for (var j = 0; j < om.length; ++j) if (om[j].X == kx && om[j].Y == ky) hm = 1;
        cm &= hm;
    }
    if (cm) { //Mojo.Controller.errorDialog($L((ic ? "Check": "Stale") + "mate!"));
        try {
            this.controller = Mojo.Controller.stageController.activeScene();
            this.controller.showAlertDialog({
                title: $L("Game Over"),
                message: $L((ic ? "Check": "Stale") + "mate!"),
                choices: [{
                    label: $L('OK'),
                    value: "refresh",
                    type: 'affirmative'
                }]
            });
        } catch(e) {
            Mojo.Log.error(e);
        }
        F = 3;
        mymoves = -1;
        $($L("gameLog")).innerHTML = "";
        $($L("playWhite")).checked = false;
        $($L("playBlack")).checked = true;
        l();
        return;
    }
    
    if (!redraw)
    {
    	Mojo.Log.error("nx engineplaywhite %d c=%d ",engineplaywhite,c);
    	Mojo.Log.error("nx engineplayblack %d c=%d ",engineplayblack,c);
    	if ((engineplaywhite && c == WHITE_FIG) || (  engineplayblack && c == BLACK_FIG)) {
        	F = 2;
        	setTimeout("cpu(!last)", 1300);        	
    	}
    }

	    
    Mojo.Log.error("function nx out");
}
