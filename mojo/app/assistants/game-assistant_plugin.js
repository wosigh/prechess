function plugin_calculate()
{
	var resp = $('polyglot').plugin_calculate(vv.sFEN);
	vv.sLastMove = "thinking!";
	vv.iRunning = 2;
	if (PreChess.ShowInfo != false) plugin_info();
}
function plugin_stop()
{
	if (PreChess.LockPlay)
	{
		setTimeout("plugin_stop()",2000);
	}
	vv.iRunning = 3;
	$('polyglot').plugin_stop();
	clearTimeout(vv.loopTimerInfo);
}
function plugin_info()
{
	if (!PreChess.LockPlay)
		info = $('polyglot').plugin_info();
	Mojo.Log.error("info " + info);
	st(info);
	vv.loopTimerInfo = setTimeout("plugin_info()", 1000);
}
function plugin_result()
{
	Mojo.Log.error("plugin_result");
	plugin_status();
	if (vv.sStatus.charAt(2) != "y") // lookfor
	{
		vv.loopTimerResult = setTimeout("plugin_result()", 500);
	}
	else
	{
		if (!PreChess.LockPlay)
		{	
			vv.sBestMove = $('polyglot').plugin_result();
			bestmove2board();
			clearTimeout(vv.loopTimerResult);
		}
		else
			vv.loopTimerResult = setTimeout("plugin_result()", 500);
		
	}
}
function plugin_result_init()
{
	Mojo.Log.error("plugin_result_init");
	plugin_status_init();
	if (vv.sStatus.charAt(0) != "y") // lookfor
	{
		vv.loopTimerResultInit = setTimeout("plugin_result_init()", 1200);
		vv.iRunning = 0;
	}
	else
	{
		vv.sLastMove = "Engine ready";
		st("");
		clearTimeout(vv.loopTimerResultInit);
	}
}
function plugin_status()
{
	if (!PreChess.LockPlay)
		vv.sStatus = $('polyglot').plugin_status();
}
function plugin_status_init()
{
	try
	{
		if (!PreChess.LockPlay)	
			vv.sStatus = $('polyglot').plugin_status();
	}
	catch (e)
	{
		vv.bEngineBroken = true;
	}
}
