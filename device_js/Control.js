var jsonCmd={};

jsonCmd.openclose=function(val)
{
	return
	{
	    "attrs":
	    {
	        "S": val
	    }
	};
}

jsonCmd.bright=function(val)
{
	return
	{
	    "attrs":
	    {
	        "W": val
	    }
	};
}

jsonCmd.ct=function(val)
{
	return
	{
	    "attrs":
	    {
	        "Y": val
	    }
	};
}

jsonCmd.color=function(val)
{
	r=val>>16&0xff;
	g=val>>8&0xff;
	b=val&0xff;
	return
	{
	    "attrs":
	     {
	        "R": r,
	        "G": g,
	        "B": b
	    }
	}
}
