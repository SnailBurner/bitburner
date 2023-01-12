/** @param {NS} ns */
// code by SnailBurner.
export async function main(ns) 
{
	let target = ns.args[0];
	let batches = Math.floor(ns.getHackTime(target) / 250);
	let pserv = ns.getPurchasedServers();
	let totalRam = 0;
	let maxRamPerBatch = 0;
	let homeRam = ns.getServerMaxRam("home");
	let ramServerRam = 0;
	let assignBatches = []; //array with server names for each batch.
	let allRamServers = [];
	let pservRam = 0;
	//get pservRam.
	if (pserv.length > 0)
	{
		for (let i = 0; i < pserv.length; ++i)
		{
			pservRam = (pservRam + ns.getServerMaxRam(pserv[i]));
		}
	}
	//get servers.
	let cashServers = [];
	let sortedCashServers = [];
	let hackingLevels = [];
	let sortedHackingLevels = [];
	let ramServers = [];
	let serverList = ns.scan("home");
	let newScan = [];
	let scanCount = 25;
	let withRoot = [];

	//scan for more servers from each known server scanCount times.
	for (let i = 0; i < scanCount; ++i)
	{
		//looping through each known server
		for (let j = 0; j < serverList.length; ++j)
		{
			//scanning at each known server
			newScan = ns.scan(serverList[j]);
			//looping through each server in the fresh scan
			for (let k = 0; k < newScan.length; ++k)
			{
				//adding the server from the fresh scan to the array of known servers
				// if it is not there already.
				if (!serverList.includes(newScan[k]))
				{
					serverList.push(newScan[k]);
				}
			}
		}
	}

	//create cashServers
	//this will be the list of servers with cash to attack.
	//and
	//create ramServers
	//this will be the list of servers with RAM to use.

	//creating cashServers from serverList.
	for (let i = 0; i < serverList.length; ++i)
	{
		cashServers.push(serverList[i]);
	}
	let purchasedServers = ns.getPurchasedServers();

	//remove home and darkweb and purchased servers
	cashServers.splice(cashServers.indexOf("home"), 1);
	if (cashServers.includes("darkweb"))
	{
		cashServers.splice(cashServers.indexOf("darkweb"), 1);
	}
	cashServers.splice(cashServers.indexOf(purchasedServers[0]), purchasedServers.length);

	//creating ramServers from cashServers
	for (let i = 0; i < cashServers.length; ++i)
	{
		ramServers.push(cashServers[i]);
	}

	//cashServers: removing servers with no cash.
	let deleteListA = [];
	for (let i = 0; i < cashServers.length; ++i)
	{
		if (ns.getServerMaxMoney(cashServers[i]) == 0)
		{
			deleteListA.push(cashServers[i]);
		}
	}
	for (let i = 0; i < deleteListA.length; ++i)
	{
		cashServers.splice(cashServers.indexOf(deleteListA[i]), 1);
	}

	//ramServers: removing servers with no RAM to use.
	let deleteListB = [];
	for (let i = 0; i < ramServers.length; ++i)
	{
		if (ns.getServerMaxRam(ramServers[i]) == 0)
		{
			deleteListB.push(ramServers[i]);
		}
	}
	for (let i = 0; i < deleteListA.length; ++i)
	{
		ramServers.splice(ramServers.indexOf(deleteListB[i]), 1);
	}

	for (let i = 0; i < ramServers.length; ++i)
	{
		ramServerRam = ramServerRam + ns.getServerMaxRam(ramServers[i]);
	}

	//copy w00.js and g00.js and h00.js to all ramServers here
	let files = ["w00.js", "g00.js", "h00.js"];
	for (let i = 0; i < ramServers.length; ++i)
	{
		ns.scp(files, ramServers[i], "home");
	}
	for (let i = 0; i < purchasedServers.length; ++i)
	{
		ns.scp(files, purchasedServers[i], "home");
	}

	//sort cashServers by required hack level here
	for (let i = 0; i < cashServers.length; ++i)
	{
		hackingLevels[i] = ns.getServerRequiredHackingLevel(cashServers[i]);
	}
	for (let i = 0; i < hackingLevels.length; ++i)
	{
		sortedHackingLevels[i] = hackingLevels[i];
	}
	sortedHackingLevels.sort((x,y) => x - y);

	for(let i = 0; i < sortedHackingLevels.length; ++i)
	{
		for (let j = 0; j < cashServers.length; ++j)
		{
			if (ns.getServerRequiredHackingLevel(cashServers[j]) == sortedHackingLevels[i])
			{
				if(!(sortedCashServers.includes(cashServers[j])))
				{
					sortedCashServers.push(cashServers[j]);
				}
			}
		}
	}

	//make withroot[] from ramservers.
	for (let i = 0; i < ramServers.length; ++i)
	{
		if (ns.hasRootAccess(ramServers[i]))
		{
			withRoot.push(ramServers[i]);
		}
	}	

	totalRam = (homeRam + ramServerRam + pservRam);
	maxRamPerBatch = (totalRam / batches);

	//make array of servers that can fit at least one batch in.
	if ((ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) > maxRamPerBatch)
	{
		allRamServers.push("home");
	}
	for (let i = 0; i < withRoot.length; ++i)
	{
		if ((ns.getServerMaxRam(withRoot[i]) - ns.getServerUsedRam(withRoot[i])) > maxRamPerBatch)
		{
			allRamServers.push(withRoot[i]);
		}
	}
	for (let i = 0; i < purchasedServers.length; ++i)
	{
		if ((ns.getServerMaxRam(purchasedServers[i]) - ns.getServerUsedRam(purchasedServers[i])) > maxRamPerBatch)
		{
			allRamServers.push(purchasedServers[i]);
		}
	}	

	//make an array with as many elements as batches 
	//with a server name assigned to each element
	//so that each batch is assigned a server to run on.
	//assignBatches[].
	for (let i = 0; i < allRamServers.length; ++i)
	{
		let batchesAtServer = Math.floor((ns.getServerMaxRam(allRamServers[i]) - ns.getServerUsedRam(allRamServers[i])) / maxRamPerBatch);
		for (let j = 0; j < batchesAtServer; ++j)
		{
			assignBatches.push(allRamServers[i]);
		}
	}

	//ns.tprint("assignBatches: " + assignBatches.length);
	//ns.tprint("batches:       " + batches);

	//calc hackCount / growCount / weakCount.
	let hackCount = Math.floor(maxRamPerBatch / 2);
	let maxCash = ns.getServerMaxMoney(target);
	let ha = ns.hackAnalyze(target);
	let cashFromOneHack = (maxCash * ha);
	let cashTaken = (hackCount * cashFromOneHack);
	if (cashTaken > maxCash)
	{
		cashTaken = maxCash;
	}
	let percentTaken = (cashTaken / maxCash);
	let percentLeft = (1 - percentTaken);
	if (percentLeft == 0)
	{
		percentLeft = 0.0001;
	}
	let growthPercentNeeded = (1 / percentLeft);
	let growCount = Math.ceil(ns.growthAnalyze(target, growthPercentNeeded, 1));
	let security1 = ns.growthAnalyzeSecurity(growCount);
	let security2 = ns.hackAnalyzeSecurity(hackCount, target);
	let securityTotal = (security1 + security2);
	let weakCount = Math.ceil(securityTotal / 0.05);
	let ramPerBatch = ((1.75 * weakCount) + (1.75 * growCount) + (1.7 * hackCount));

	//calc hackCount / growCount / weakCount.
	if (ramPerBatch > maxRamPerBatch)
	{
		while (ramPerBatch > maxRamPerBatch)
		{
			hackCount = hackCount - 1;
			cashTaken = (hackCount * cashFromOneHack);
			if (cashTaken > maxCash)
			{
				cashTaken = maxCash;
			}
			percentTaken = (cashTaken / maxCash);
			percentLeft = (1 - percentTaken);
			if (percentLeft == 0)
			{
				percentLeft = 0.0001;
			}			
			growthPercentNeeded = (1 / percentLeft);
			growCount = Math.ceil(ns.growthAnalyze(target, growthPercentNeeded, 1));
			security1 = ns.growthAnalyzeSecurity(growCount);
			security2 = ns.hackAnalyzeSecurity(hackCount, target);
			securityTotal = (security1 + security2);
			weakCount = Math.ceil(securityTotal / 0.05);
			ramPerBatch = ((1.75 * weakCount) + (1.75 * growCount) + (1.7 * hackCount));
			await ns.sleep(25);
		}
	}
	if (hackCount > 10)
	{
		hackCount = Math.floor(0.7 * hackCount);
	}

	await ns.sleep(250);

	//send batchers with W/G/H commands.
	for (let i = 0; i < assignBatches.length; ++i)
	{
		ns.exec("masshit.js", "home", 1, target, assignBatches[i], hackCount, growCount, weakCount, i);
	}


}