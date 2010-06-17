function l(update)
{
	Mojo.Log.error("function l in");
	if (!update)
	{
		vv.aBoard = [];
		vv.iColor = vv.cWHITE_FIG;
	}
	for (i = 0; i < 8; ++i) Z(Z(vv.aBoard, i, 6, 65), i, 1, 129);
	d(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(Z(vv.aBoard, 0, 0, 132), 1, 0, 130), 2, 0, 131), 3, 0, 133), 4, 0, 134), 5, 0, 131), 6, 0, 130), 7, 0, 132), 0, 7, 68), 1, 7, 66), 2, 7, 67), 3, 7, 69), 4, 7, 70), 5, 7, 67), 6, 7, 66), 7, 7, 68));
	Mojo.Log.error("function l out");
}
// showmoves


function sm(i)
{
	Mojo.Log.error("function sm in");
	if (N > 200) return;
	var j = "abcdefgh";
	if (N & 1)
	{
		if (N < 19) K += " ";
		K += (1 + N >> 1) + ". ";
	}
	else
	{
		K += "   ";
	}
	if (i.f == 3) K += "o-o  ";
	else if (i.f == 5) K += "o-o-o";
	else K += j.charAt(i.x) + (8 - i.y) + " " + j.charAt(i.X) + (8 - i.Y);
	if (++N & 1) K += "XX\n";
	Mojo.Log.error("function sm out");
}
function un(u, b)
{
	for (var i = u.x.length - 1; i >= 0; --i) Z(b, u.x[i], u.y[i], u.p[i]);
}
function au(u, b, x, y)
{
	u.x.push(x);
	u.y.push(y);
	u.p.push(b[x + y * 8]);
}
function st(x)
{
	if (vv.iMoves > 0)
	{
		y = "\u00A0" + "[" + ((+vv.iMoves + vv.iMoves % 2) / 2 + 1) + "] " + vv.sLastMove + "<br>" + x + "<br>";
	}
	else
	{
		y = "\u00A0" + "[-]" + " " + vv.sLastMove + "<br>" + x + "<br>";
	}
	$($L("gametime")).innerHTML = y;
}
function P(x, y, X, Y, f)
{
	this.x = x;
	this.y = y;
	this.X = X;
	this.Y = Y;
	this.f = f;
}
function U()
{
	this.x = [];
	this.y = [];
	this.p = [];
}
// empty


function em(b, x, y)
{
	return !b[x + y * 8];
}
// figur whithout color


function ge(b, x, y)
{
	return b[x + y * 8] & 7;
}
function co(b, x, y)
{
	return b[x + y * 8] & vv.cCHANGE_COLOR;
}
// is figure with right color


function sa(b, x, y, c)
{
	var i = b[x + y * 8];
	return i && (i & c);
}
function op(b, x, y, c)
{
	var i = b[x + y * 8];
	return i && !(i & c);
}
// already moved 


function mo(b, x, y)
{
	var i = b[x + y * 8];
	return i && (i & 32);
}
function la(b, x, y)
{
	var i = b[x + y * 8];
	return i && (i & 16);
}
function ra(x, y)
{
	return x >= 0 && x < 8 && y >= 0 && y < 8;
}
function di(c)
{
	return vv.iColor == vv.cWHITE_FIG ? -1 : 1;
}
// 


function Z(b, x, y, p)
{
	b[x + y * 8] = p;
	return b;
}
function t(b, x, y, i, j, c, l)
{
	var X = x;
	var Y = y;
	while (ra(X += i, Y += j) && em(b, X, Y)) l.push(new P(x, y, X, Y, 0));
	if (ra(X, Y) && op(b, X, Y, c)) l.push(new P(x, y, X, Y, 0));
	return l;
}
// rook


function ro(b, x, y, c, l)
{
	t(b, x, y, 1, 0, c, t(b, x, y, -1, 0, c, t(b, x, y, 0, 1, c, t(b, x, y, 0, -1, c, l))));
}
// bishop


function bi(b, x, y, c, l)
{
	t(b, x, y, 1, 1, c, t(b, x, y, -1, -1, c, t(b, x, y, 1, -1, c, t(b, x, y, -1, 1, c, l))));
}
// king


function ki(b, x, y, c, l)
{
	for (var i = -1; i < 2; ++i) for (var j = -1; j < 2; ++j)
	{
		var X = x + i;
		var Y = y + j;
		if ((X || Y) && ra(X, Y) && !sa(b, X, Y, c)) l.push(new P(x, y, X, Y, 0));
	}
	if (!mo(b, x, y)) if (em(b, 5, y) && em(b, 6, y) && !em(b, 7, y) && !mo(b, 7, y))
	{
		var u = new U();
		au(u, b, x, y);
		Z(b, x, y, 0);
		var i = fi(b, c ^ vv.cCHANGE_COLOR);
		var j = 0;
		var X = -1;
		while (!j && ++X != i.length) j = i[X].Y == y && i[X].X == 5;
		if (!j) l.push(new P(x, y, 6, y, 3));
		un(u, b);
	}
	else if (em(b, 3, y) && em(b, 2, y) && em(b, 1, y) && !em(b, 0, y) && !mo(b, 0, y))
	{
		var u = new U();
		au(u, b, x, y);
		Z(b, x, y, 0);
		var i = fi(b, c ^ vv.cCHANGE_COLOR);
		var j = 0;
		var X = -1;
		while (!j && ++X != i.length) j = i[X].Y == y && i[X].X == 3;
		if (!j) l.push(new P(x, y, 2, y, 5));
		un(u, b);
	}
}
// knight


function kn(b, x, y, c, l)
{
	for (var i = -2; i < 3; ++i) for (var j = -2; j < 3; ++j) if (Math.abs(i) + Math.abs(j) == 3)
	{
		var X = x + i;
		var Y = y + j;
		if (ra(X, Y) && !sa(b, X, Y, c)) l.push(new P(x, y, X, Y, 0));
	}
}
// pawn


function pa(b, x, y, c, l)
{
	var Y = y + di(c);
	var Z = y + di(c) * 2;
	if (!mo(b, x, y) && em(b, x, Y) && em(b, x, Z))
	{
		l.push(new P(x, y, x, Z, 2));
	}
	if (em(b, x, Y))
	{
		if (!Y || Y == 7)
		{
			l.push(new P(x, y, x, Y, 4));
		}
		else
		{
			l.push(new P(x, y, x, Y, 0));
		}
	}
	for (var i = -1; i < 2; i += 2)
	{
		var X = x + i;
		if (ra(X, Y))
		{
			if (op(b, X, Y, c))
			{
				if (!Y || Y == 7)
				{
					l.push(new P(x, y, X, Y, 4));
				}
				else
				{
					l.push(new P(x, y, X, Y, 0));
				}
			}
			else
			{
				// en-passent
				if ((x == 3 || x == 4) && vv.bEnPassentMarker)
				{
					if (op(b, X, y, c))
					{
						l.push(new P(x, y, X, Y, 1));
					}
				}
				if (em(b, X, Y) && la(b, X, Y - di(c)))
				{
					l.push(new P(x, y, X, Y, 1));
				}
			}
		}
	}
}
// draw


function d(b)
{
	if (!PreChess.InvBoard)
	{
		for (var y = 0; y < 8; ++y) for (var x = 0; x < 8; ++x)
		{
			var i = "<img src=\"images/";
			if (vv.iAction == 1 && x == px && y == py) i += "s";
			i += (x + y & 1) ? "b" : "w";
			if (!em(b, x, y)) i += (sa(b, x, y, vv.cWHITE_FIG) ? "w" : "b") + (ge(b, x, y) & 7);
			document.getElementById("" + x + y).innerHTML = i + ".png\">";
		}
	}
	else
	{
		for (var y = 0; y < 8; ++y) for (var x = 0; x < 8; ++x)
		{
			var i = "<img src=\"images/";
			if (vv.iAction == 1 && 7 - x == px && 7 - y == py) i += "s";
			i += (7 - x + (7 - y) & 1) ? "b" : "w";
			if (!em(b, 7 - x, 7 - y)) i += (sa(b, 7 - x, 7 - y, vv.cWHITE_FIG) ? "w" : "b") + (ge(b, 7 - x, 7 - y) & 7);
			document.getElementById("" + x + y).innerHTML = i + ".png\">";
		}
	}
}
function dxxx(b)
{
	if (!PreChess.InvBoard)
	{
		for (var y = 0; y < 8; ++y) for (var x = 0; x < 8; ++x)
		{
			var i = "<img src=\"images/";
			i += (x + y & 1) ? "b" : "w";
			if (!em(b, x, y)) i += (sa(b, x, y, vv.cWHITE_FIG) ? "w" : "b") + (ge(b, x, y) & 7);
			document.getElementById("" + x + y).innerHTML = i + ".png\">";
		}
	}
	else
	{
		for (var y = 0; y < 8; ++y) for (var x = 0; x < 8; ++x)
		{
			var i = "<img src=\"images/";
			i += (7 - x + (7 - y) & 1) ? "b" : "w";
			if (!em(b, 7 - x, 7 - y)) i += (sa(b, 7 - x, 7 - y, vv.cWHITE_FIG) ? "w" : "b") + (ge(b, 7 - x, 7 - y) & 7);
			document.getElementById("" + x + y).innerHTML = i + ".png\">";
		}
	}
}
function ma(b, m)
{
	u = new U();
	for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) if (la(b, x, y))
	{
		au(u, b, x, y);
		Z(b, x, y, ge(b, x, y) | co(b, x, y) | mo(b, x, y));
	}
	au(u, b, m.X, m.Y);
	if (m.f == 4) Z(b, m.X, m.Y, 37 | co(b, m.x, m.y));
	if (m.f == 2) Z(b, m.X, m.Y, ge(b, m.x, m.y) | co(b, m.x, m.y) | 32 | 16); 
	if (m.f != 4 && m.f != 2) Z(b, m.X, m.Y, ge(b, m.x, m.y) | co(b, m.x, m.y) | 32 | 0);
	au(u, b, m.x, m.y);
	Z(b, m.x, m.y, 0);
	if (m.f == 1)
	{
		au(u, b, m.X, m.Y - di(vv.iColor));
		Z(b, m.X, m.Y - di(vv.iColor), 0);
	}
	else if (m.f == 3)
	{
		au(u, b, 5, m.y);
		au(u, b, 7, m.y);
		Z(Z(b, 5, m.y, ge(b, 7, m.y) | co(b, 7, m.y) | 32), 7, m.y, 0);
	}
	else if (m.f == 5)
	{
		au(u, b, 3, m.y);
		au(u, b, 0, m.y);
		Z(Z(b, 3, m.y, ge(b, 0, m.y) | co(b, 0, m.y) | 32), 0, m.y, 0);
	}
	return u;
}
// figur


function fi(b, c)
{
	var l = [];
	for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) if (sa(b, x, y, c))
	{
		var i = ge(b, x, y);
		if (i == 1) pa(b, x, y, c, l);
		else if (i == 2) kn(b, x, y, c, l);
		else if (i == 3) bi(b, x, y, c, l);
		else if (i == 4) ro(b, x, y, c, l);
		else if (i == 5)
		{
			bi(b, x, y, c, l);
			ro(b, x, y, c, l);
		}
		else if (i == 6) ki(b, x, y, c, l);
	}
	for (var i = 0; i < l.length / 3; ++i)
	{
		var j = Math.floor(Math.random() * l.length);
		var k = Math.floor(Math.random() * l.length);
		var x = l[j];
		l[j] = l[k];
		l[k] = x;
	}
	return l;
}
function cpu(white)
{
	Mojo.Log.error("function cpu in");
	var i = PreChess.MoveTime * 1;
	if (vv.iRunning == 0)
	{
		Mojo.Log.error("cpu iColor" + vv.iColor);
		vv.iRunning = 1;
		vv.sFEN = smfen()
		vv.loopTimerCalc = setTimeout("plugin_calculate()", 0);
		vv.loopTimerStop = setTimeout("plugin_stop()", i);
		vv.loopTimerResult = setTimeout("plugin_result()", i + 1000);
	}
	Mojo.Log.error("function cpu out");
}
var Sp = [0, 60, 370, 370, 450, 1000, 5000];
var Sb = [
	[0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 0, 0, 4, 3, 2, 4, 6, 12, 12, 12, 4, 6, 4, 4, 7, 18, 25, 25, 16, 7, 4, 6, 11, 18, 27, 27, 16, 11, 6, 10, 15, 24, 32, 32, 24, 15, 10, 10, 15, 24, 32, 32, 24, 15, 10, 0, 0, 0, 0, 0, 0, 0, 0],
	[-7, -3, 1, 3, 3, 1, -3, -7, 2, 6, 14, 20, 20, 14, 6, 2, 6, 14, 22, 26, 26, 22, 14, 6, 8, 18, 26, 30, 30, 26, 18, 8, 8, 18, 30, 32, 32, 30, 18, 8, 6, 14, 28, 32, 32, 28, 14, 6, 2, 6, 14, 20, 20, 14, 6, 2, -7, -3, 1, 3, 3, 1, -3, -7],
	[16, 16, 16, 16, 16, 16, 16, 16, 26, 29, 31, 31, 31, 31, 29, 26, 26, 28, 32, 32, 32, 32, 28, 26, 16, 26, 32, 32, 32, 32, 26, 16, 16, 26, 32, 32, 32, 32, 26, 16, 16, 28, 32, 32, 32, 32, 28, 16, 16, 29, 31, 31, 31, 31, 29, 16, 16, 16, 16, 16, 16, 16, 16, 16],
	[0, 0, 0, 3, 3, 0, 0, 0, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0],
	[-2, -2, -2, 0, 0, -2, -2, -2, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0],
	[3, 3, 8, -12, -8, -12, 10, 5, 0, 0, -5, -5, -12, -12, -12, -12, -5, -5, -7, -15, -15, -15, -15, -15, -15, -7, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20],
	[]
];
function sc(b, c)
{
	var s = 0;
	for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y)
	{
		var i = ge(b, x, y);
		if (i) if (sa(b, x, y, vv.cBLACK_FIG)) s += Sb[i == 6 ? 6 : i - 1][(7 - x) + y * 8] + Sp[i];
		else s -= Sb[i - 1][x + (7 - y) * 8] + Sp[i];
	}
	return vv.iColor == vv.cBLACK_FIG ? s : -s;
}
function hu(x, y)
{
	Mojo.Log.error("function hu in");
	if (PreChess.InvBoard)
	{
		x = 7 - x;
		y = 7 - y;
	}
	var b_old1 = [];
	b_old1 = vv.aBoard.clone();
	if (vv.iAction == 0)
	{
		if (sa(vv.aBoard, x, y, vv.iColor))
		{
			px = x;
			py = y;
			vv.iAction = 1;
			d(vv.aBoard);
		}
	}
	else if (vv.iAction == 1)
	{
		if (x == px && y == py)
		{
			vv.iAction = 0;
			d(vv.aBoard);
			Mojo.Log.error("hu() iAction=1 x=px y=py");
			return;
		}
		var m = fi(vv.aBoard, vv.iColor);
		for (var i = 0; i < m.length; ++i)
		{
			if (m[i].x == px && m[i].y == py && m[i].X == x && m[i].Y == y && ge(vv.aBoard, x, y) != 6)
			{
				var u = ma(vv.aBoard, m[i]);
				var o = fi(vv.aBoard, vv.iColor ^ vv.cCHANGE_COLOR);
				for (var j = 0; j < o.length; ++j) if (ge(vv.aBoard, o[j].X, o[j].Y) == 6 && sa(vv.aBoard, o[j].X, o[j].Y, vv.iColor))
				{
					un(u, vv.aBoard);
					Mojo.Log.error("hu() invalid move");
					st("Invalid move");
					return;
				}
				vv.bEnPassentMarker = false;
				if (ge(vv.aBoard, x, y) == 1) // pawn
				{
					// At this point the pawn after a double move is missing, now fix it				
					if (Math.abs(m[i].Y - m[i].y) == 2)
					{
						vv.bEnPassentMarker = true;
						if (m[i].y > 1)
						{
							vv.aBoard[m[i].X + m[i].Y * 8] = 97;
						}
						else
						{
							vv.aBoard[m[i].X + m[i].Y * 8] = 161;
						}
					}
				}
				delta_calc(b_old1, vv.aBoard);
				redo_remove();
				nx();
				vv.iMoves += 1;
				vv.that.SaveGame();
				Mojo.Log.error("hu() SaveGame");
				return;
			}
		}
		st(" Invalid move");
		Mojo.Log.error("hu() invalid move 2");
	}
	Mojo.Log.error("function hu out");
}
function nx(redraw)
{
	Mojo.Log.error("function nx in");
	vv.iColor ^= vv.cCHANGE_COLOR;
	vv.iAction = 0;
	d(vv.aBoard);
	for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) if (ge(vv.aBoard, x, y) == 6 && sa(vv.aBoard, x, y, vv.iColor))
	{
		var kx = x;
		var ky = y;
	}
	var m = fi(vv.aBoard, vv.iColor ^ vv.cCHANGE_COLOR);
	var ic = 0;
	for (var i = 0; i < m.length; ++i) if (m[i].X == kx && m[i].Y == ky) ic = 1;
	var m = fi(vv.aBoard, vv.iColor);
	var cm = 1;
	for (var i = 0; i < m.length; ++i)
	{
		var u = ma(vv.aBoard, m[i]);
		for (var x = 0; x < 8; ++x) for (var y = 0; y < 8; ++y) if (ge(vv.aBoard, x, y) == 6 && sa(vv.aBoard, x, y, vv.iColor))
		{
			var kx = x;
			var ky = y;
		}
		var om = fi(vv.aBoard, vv.iColor ^ vv.cCHANGE_COLOR);
		un(u, vv.aBoard);
		var hm = 0;
		for (var j = 0; j < om.length; ++j) if (om[j].X == kx && om[j].Y == ky) hm = 1;
		cm &= hm;
	}
	if (cm)
	{
		question();
		return;
	}

	Mojo.Log.error("function nx out");
}