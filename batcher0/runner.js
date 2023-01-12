/** @param {NS} ns */
// code by SnailBurner.
export async function main(ns) 
{

	let count = 0;
	while (true)
	{
		if (ns.getServerMoneyAvailable("home") > 45000000000000)
		{
			ns.purchaseServer("home", 1048576);
		}
		let target = ns.args[0];	
		let sleeptime = (ns.getWeakenTime(target) + ns.getHackTime(target) + 2000);
		while (ns.scriptRunning("masshit.js", "home") || ns.scriptRunning("jobs.js", "home"))
		{
			await ns.sleep(2000);
		}
		ns.exec("jobs.js", "home", 1, target, count);
		await ns.sleep(sleeptime);
		++count;
	}


}