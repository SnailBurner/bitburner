/** @param {NS} ns */
//code by SnailBurner.
//uses hacked servers to prep/hack target server
import { GetServersWithRootPlease } from "/snailBurner/utility/snailFunctions.js";

export async function main(ns) 
{
	let target = ns.args[0];
	let myServers = GetServersWithRootPlease(ns);
	let totalFreeThreads;
	let freeThreads;
	let needSecurity;
	let multi;
	let needWeakThreads;
	let weakCount;
	let growPercentage;
	let needGrowThreads;
	let growCount;
	let growWait;
	let needHackThreads;
	let hackCount;
	let batches;
	let hackWait;
	let myPlayer = ns.getPlayer();
	let myServer = ns.getServer(target);
	let endMoney;

	while (true)
	{
		myPlayer = ns.getPlayer();
		myServer = ns.getServer(target);		
		myServers = GetServersWithRootPlease(ns);
		totalFreeThreads = 0;
		//calc total free threads
		for (let i = 0; i < myServers.length; i++)
		{
			freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
			totalFreeThreads = (totalFreeThreads + freeThreads);
		}
		//calc weaken threads needed to get to min security
		needSecurity = (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target));
		multi = (1 / (ns.weakenAnalyze(1, 1)));
		needWeakThreads = Math.ceil(needSecurity * multi); 
		//launch weakens
		if (needWeakThreads > 0)
		{
			for (let i = 0; i < myServers.length; i++)
			{
				freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
				if ((freeThreads > 0) && (needWeakThreads > 0) && (freeThreads <= needWeakThreads))
				{
					needWeakThreads = (needWeakThreads - freeThreads);
					totalFreeThreads = (totalFreeThreads - freeThreads);
					ns.exec("w.js", myServers[i], freeThreads, target, freeThreads, false, 0);
					freeThreads = 0;
				}
				if ((freeThreads > 0) && (needWeakThreads > 0) && (needWeakThreads < freeThreads))
				{
					freeThreads = (freeThreads - needWeakThreads);
					totalFreeThreads = (totalFreeThreads - needWeakThreads);
					ns.exec("w.js", myServers[i], needWeakThreads, target, needWeakThreads, false, 0);
					needWeakThreads = 0;
				}				
			}
			await ns.sleep(2);
		}
		//calc grow threads and weak threads needed to get to max money
		growPercentage = (ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target));
		needGrowThreads = Math.ceil(ns.growthAnalyze(target, growPercentage, 1));
		needSecurity = (needGrowThreads * 0.004);
		multi = (1 / (ns.weakenAnalyze(1, 1)));
		needWeakThreads = Math.ceil(needSecurity * multi);
		growWait = (ns.getWeakenTime(target) - ns.getGrowTime(target));
		//launch grows and weakens
		if (needGrowThreads > 0)
		{
			//launch grows
			for (let i = 0; i < myServers.length; i++)
			{
				freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
				if ((freeThreads > 0) && (needGrowThreads > 0) && (freeThreads <= needGrowThreads))
				{
					needGrowThreads = (needGrowThreads - freeThreads);
					totalFreeThreads = (totalFreeThreads - freeThreads);
					ns.exec("g.js", myServers[i], freeThreads, target, freeThreads, false, growWait);
					freeThreads = 0;
				}
				if ((freeThreads > 0) && (needGrowThreads > 0) && (needGrowThreads < freeThreads))
				{
					freeThreads = (freeThreads - needGrowThreads);
					totalFreeThreads = (totalFreeThreads - needGrowThreads);
					ns.exec("g.js", myServers[i], needGrowThreads, target, needGrowThreads, false, growWait);
					needGrowThreads = 0;
				}				
			}
			//launch weakens
			for (let i = 0; i < myServers.length; i++)
			{
				freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
				if ((freeThreads > 0) && (needWeakThreads > 0) && (freeThreads <= needWeakThreads))
				{
					needWeakThreads = (needWeakThreads - freeThreads);
					totalFreeThreads = (totalFreeThreads - freeThreads);
					ns.exec("w.js", myServers[i], freeThreads, target, freeThreads, false, 0);
					freeThreads = 0;
				}
				if ((freeThreads > 0) && (needWeakThreads > 0) && (needWeakThreads < freeThreads))
				{
					freeThreads = (freeThreads - needWeakThreads);
					totalFreeThreads = (totalFreeThreads - needWeakThreads);
					ns.exec("w.js", myServers[i], needWeakThreads, target, needWeakThreads, false, 0);
					needWeakThreads = 0;
				}				
			}
			await ns.sleep(2);			
		}
		//calc hacks, grows, and weakens
		myServer.moneyAvailable = myServer.moneyMax;
		myServer.hackDifficulty = myServer.minDifficulty;
		needHackThreads = 15;
		endMoney = (myServer.moneyMax - (needHackThreads * ns.formulas.hacking.hackPercent(myServer, myPlayer) * myServer.moneyMax));
		myServer.moneyAvailable = endMoney;
		needGrowThreads = Math.ceil(ns.formulas.hacking.growThreads(myServer, myPlayer, myServer.moneyMax, 1));
		needSecurity = ((needGrowThreads * 0.004) + (needHackThreads * 0.002));
		multi = (1 / (ns.weakenAnalyze(1, 1)));
		needWeakThreads = Math.ceil(needSecurity * multi);
		batches = Math.floor(totalFreeThreads / (needHackThreads + needGrowThreads + needWeakThreads));
		growWait = (ns.getWeakenTime(target) - ns.getGrowTime(target));
		hackWait = (ns.getWeakenTime(target) - ns.getHackTime(target));
		//launch batches......
		//launch hacks if not enough threads for a batch
		if ((batches < 1) && (totalFreeThreads > 0))
		{
			for (let i = 0; i < myServers.length; i++)
			{
				freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
				if (freeThreads > 0)
				{
					totalFreeThreads = (totalFreeThreads - freeThreads);
					ns.exec("h.js", myServers[i], freeThreads, target, freeThreads, false, hackWait);
					freeThreads = 0;
				}
			}			
		}
		//launch batches
		if (batches >= 1)
		{
			for (let i = 0; i < batches; i++)
			{
				hackCount = needHackThreads;
				growCount = needGrowThreads;
				weakCount = needWeakThreads;
				//launch hacks
				for (let i = 0; i < myServers.length; i++)
				{
					freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
					if ((freeThreads > 0) && (hackCount > 0) && (freeThreads <= hackCount))
					{
						hackCount = (hackCount - freeThreads);
						totalFreeThreads = (totalFreeThreads - freeThreads);
						ns.exec("h.js", myServers[i], freeThreads, target, freeThreads, false, hackWait);
						freeThreads = 0;
					}
					if ((freeThreads > 0) && (hackCount > 0) && (hackCount < freeThreads))
					{
						freeThreads = (freeThreads - hackCount);
						totalFreeThreads = (totalFreeThreads - hackCount);
						ns.exec("h.js", myServers[i], hackCount, target, hackCount, false, hackWait);
						hackCount = 0;
					}	
				}
				//launch grows
				for (let i = 0; i < myServers.length; i++)
				{
					freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
					if ((freeThreads > 0) && (growCount > 0) && (freeThreads <= growCount))
					{
						growCount = (growCount - freeThreads);
						totalFreeThreads = (totalFreeThreads - freeThreads);
						ns.exec("g.js", myServers[i], freeThreads, target, freeThreads, false, growWait);
						freeThreads = 0;
					}
					if ((freeThreads > 0) && (growCount > 0) && (growCount < freeThreads))
					{
						freeThreads = (freeThreads - growCount);
						totalFreeThreads = (totalFreeThreads - growCount);
						ns.exec("g.js", myServers[i], growCount, target, growCount, false, growWait);
						growCount = 0;
					}	
				}
				//lanch weakens
				for (let i = 0; i < myServers.length; i++)
				{
					freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
					if ((freeThreads > 0) && (weakCount > 0) && (freeThreads <= weakCount))
					{
						weakCount = (weakCount - freeThreads);
						totalFreeThreads = (totalFreeThreads - freeThreads);
						ns.exec("w.js", myServers[i], freeThreads, target, freeThreads, false, 0);
						freeThreads = 0;
					}
					if ((freeThreads > 0) && (weakCount > 0) && (weakCount < freeThreads))
					{
						freeThreads = (freeThreads - weakCount);
						totalFreeThreads = (totalFreeThreads - weakCount);
						ns.exec("w.js", myServers[i], weakCount, target, weakCount, false, 0);
						weakCount = 0;
					}	
				}					
			}
		}
		//launch weakens with any spare ram
		if (totalFreeThreads > 0)
		{
			for (let i = 0; i < myServers.length; i++)
			{
				freeThreads = Math.floor((ns.getServerMaxRam(myServers[i]) - ns.getServerUsedRam(myServers[i])) / 1.75);
				if (freeThreads > 0)
				{
					ns.exec("w.js", myServers[i], freeThreads, target, freeThreads, false, 0);
					freeThreads = 0;
				}			
			}
			await ns.sleep(2);
		}
		await ns.sleep(2000 + ns.getWeakenTime(target));
	}
}
