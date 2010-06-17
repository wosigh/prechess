function doNewGame()
{
	Mojo.Log.error("doNewGame");
	var tmp_delta_cnts = 0;
	var tmp_delta = [];
	clearTimeout(vv.loopTimerCalc);
	clearTimeout(vv.loopTimerStop);
	clearTimeout(vv.loopTimerResult);
	clearTimeout(vv.loopTimerInfo);
	vv.iMattMove=999;
	vv.iAction = 0;
	vv.iRunning = 0;
	vv.iColor = vv.cWHITE_FIG;
	vv.sLastMove = "New Game";
	st("");
	for (;;)
	{
		if (vv.aDeltaCnt.length > 0)
		{
			tmp_delta_cnts = vv.aDeltaCnt.pop();
			tmp_delta = vv.aDelta.pop();
		}
		else
		{
			break;
		}
	}
	for (;;)
	{
		if (vv.aRedoCnt.length > 0)
		{
			tmp_delta_cnts = vv.aRedoCnt.pop();
			tmp_delta = vv.aRedo.pop();
		}
		else
		{
			break;
		}
	}
	vv.iMoves = 0;
	vv.aBoard = initboard.clone();
	dxxx(vv.aBoard);
	vv.iAction = 0;
}

function delta_calc(b_old, b_new)
{
	Mojo.Log.error("delta_calc %d %d");
	var tmp_delta = [];
	var tmp_delta_cnt = 0;
	for (var x = 0; x < 8; x++)
	{
		for (var y = 0; y < 8; y++)
		{
			if (b_old[x + y * 8] != b_new[x + y * 8])
			{
				tmp_delta[tmp_delta_cnt] = x + y * 8;
				if (b_old[x + y * 8] > 0 )
				{
					tmp_delta[tmp_delta_cnt + 1] = b_old[x + y * 8];
				}
				else
				{
					tmp_delta[tmp_delta_cnt + 1] = 0;					
				}
				tmp_delta_cnt++;
				tmp_delta_cnt++;
			}
		}
	}
	vv.aDelta.push(tmp_delta);
	vv.aDeltaCnt.push(tmp_delta_cnt);
	

}


function redo_remove()
{
	for (;;)
	{
		if (vv.aRedoCnt.length > 0)
		{
			tmp_delta_cnt = vv.aRedoCnt.pop();
			tmp_delta = vv.aRedo.pop();
		}
		else
		{
			break;
		}
	}
}


function redo_calc(b_old, b_new)
{
	Mojo.Log.error("redo_calc");
	var tmp_delta = [];
	var tmp_delta_cnt = 0;
	for (var x = 0; x < 8; x++)
	{
		for (var y = 0; y < 8; y++)
		{
			if (b_old[x + y * 8] != b_new[x + y * 8])
			{
				tmp_delta[tmp_delta_cnt] = x + y * 8;
				if (b_old[x + y * 8] == 'undefined')
				{
					tmp_delta[tmp_delta_cnt + 1] = 0;
				}
				else
				{
					tmp_delta[tmp_delta_cnt + 1] = b_old[x + y * 8];
				}
				tmp_delta_cnt++;
				tmp_delta_cnt++;
			}
		}
	}
	vv.aRedo.push(tmp_delta);
	vv.aRedoCnt.push(tmp_delta_cnt);
}
function delta_back()
{
	var tmp_delta_cnt;
	var tmp_delta;
	for (j = 0; j < 2; j++)
	{
		if (vv.aDeltaCnt.length > 0)
		{
			tmp_delta_cnt = vv.aDeltaCnt.pop();
			tmp_delta = vv.aDelta.pop();
			Mojo.Log.error("delta_cnt" + tmp_delta_cnt);
			var b_old2 = [];
			b_old2 = vv.aBoard.clone();
			for (var d = 0; d < (tmp_delta_cnt / 2); d++)
			{
				Mojo.Log.error("delta[d*2]" + tmp_delta[d * 2]);
				Mojo.Log.error("delta[d*2+1]" + tmp_delta[d * 2 + 1]);
				vv.aBoard[tmp_delta[d * 2]] = tmp_delta[d * 2 + 1];
			}
			redo_calc(b_old2, vv.aBoard);
			vv.iColor = vv.iColor ^ vv.cCHANGE_COLOR;
			vv.iMoves = vv.iMoves - 1;
			if (j == 1)
			{
				dxxx(vv.aBoard);
				vv.iAction = 0;
			}
		}
	}
}
function delta_fwd()
{
	var tmp_delta_cnt;
	var tmp_delta;
	for (j = 0; j < 2; j++)
	{
		if (vv.aRedoCnt.length > 0)
		{
			Mojo.Log.error("delta_fwd"+vv.aRedoCnt.length);
			tmp_delta_cnt = vv.aRedoCnt.pop();
			tmp_delta = vv.aRedo.pop();
			var b_old2 = [];
			b_old2 = vv.aBoard.clone();
			for (var d = 0; d < (tmp_delta_cnt / 2); d++)
			{
				Mojo.Log.error("delta[d]" + tmp_delta[d]);
				Mojo.Log.error("delta[d+1]" + tmp_delta[d + 1]);
				vv.aBoard[tmp_delta[d * 2]] = tmp_delta[d * 2 + 1];
			}
			
			delta_calc(b_old2, vv.aBoard);
						
			vv.iColor = vv.iColor ^ vv.cCHANGE_COLOR;
			vv.iMoves = vv.iMoves + 1;		
		}
		if (j == 1)
		{
			vv.iAction = 0;
			dxxx(vv.aBoard);
		}
		
	}
}
