/** @param {NS} ns */
// code by SnailBurner.
export async function main(ns) 
{
	let target = ns.args[0];
	let server = ns.args[1];
	let hackCount = ns.args[2];
	let growCount = ns.args[3];
	let weakCount = ns.args[4];
	let counter = ns.args[5];

	await ns.sleep(1000);

	if (counter > 0)
	{
		await ns.sleep(counter * 250);
	}

	//begin weakening.
	if (weakCount > 0)
	{
		ns.exec("w00.js", server, weakCount, target, counter);
	}

	//sleep and begin growing.
	await ns.sleep(ns.getWeakenTime(target) - ns.getGrowTime(target) - 75);
	if (growCount > 0)
	{
		ns.exec("g00.js", server, growCount, target, counter);
	}

	//sleep and begin hacking.
	await ns.sleep(ns.getGrowTime(target) - ns.getHackTime(target) - 75);
	if (hackCount > 0)
	{
		ns.exec("h00.js", server, hackCount, target, counter);
	}

	//sleep until 50ms before hack completes.
	await ns.sleep(ns.getHackTime(target) - 50);
	//if not at min sec and max cash: kill hackers!!!
	if ((ns.getServerSecurityLevel(target) !== ns.getServerMinSecurityLevel(target)) || (ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)))
	{
		ns.kill("h00.js", server, hackCount, target, counter);
	}


}