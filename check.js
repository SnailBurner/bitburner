/** @param {NS} ns */
// code by SnailBurner.

export async function main(ns) 
{
	let target = ns.args[0];

	ns.tprint(target + "'s required hacking level: " + ns.getServerRequiredHackingLevel(target));
	if (!ns.hasRootAccess(target))
	{
		ns.tprint("ROOT ACCESS REQUIRED.");
	}
	//if prepared...
	if ((ns.getServerMinSecurityLevel(target) == ns.getServerSecurityLevel(target)) && (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)))
	{
		ns.tprint("min sec:  " + ns.getServerMinSecurityLevel(target));
		ns.tprint("max cash: " + ns.getServerMaxMoney(target));
	}
	else if (true)
	{
		ns.tprint("Security: " + ns.getServerSecurityLevel(target) + " / " + ns.getServerMinSecurityLevel(target));
		ns.tprint("Money: " + ns.getServerMoneyAvailable(target) + " / " + ns.getServerMaxMoney(target));
	}
	ns.tprint("hack time: " + Math.floor(ns.getHackTime(target) / 1000));
	ns.tprint("grow time: " + Math.floor(ns.getGrowTime(target) / 1000));
	ns.tprint("weak time: " + Math.floor(ns.getWeakenTime(target) / 1000));
}

