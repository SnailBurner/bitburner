/** @param {NS} ns */
//snailFunctions.js
//code by SnailBurner.


//cut paste from below into .js file.

/**
list of functions:

import { GetFiles } from "/snailBurner/utility/snailFunctions.js";

import { GetFactions } from "/snailBurner/utility/snailFunctions.js";

import { GetAugments } from "/snailBurner/utility/snailFunctions.js";

import { CopyFiles } from "/snailBurner/utility/snailFunctions.js";

import { BuyServer } from "/snailBurner/utility/snailFunctions.js";

import { BuyTor } from "/snailBurner/utility/snailFunctions.js";

import { BuyBrute } from "/snailBurner/utility/snailFunctions.js";

import { GetServers } from "/snailBurner/utility/snailFunctions.js";

import { GetHacknetServers } from "/snailBurner/utility/snailFunctions.js";

import { GetShortenedServerList } from "/snailBurner/utility/snailFunctions.js";

import { GetRamServersPlease } from "/snailBurner/utility/snailFunctions.js";

import { GetCashServersPlease } from "/snailBurner/utility/snailFunctions.js";

import { GetTopServer } from "/snailBurner/utility/snailFunctions.js";

import { GetTargets } from "/snailBurner/utility/snailFunctions.js";

import { GetServersWithRootPlease } from "/snailBurner/utility/snailFunctions.js";
		
import { GetUsableServers } from "/snailBurner/utility/snailFunctions.js";
		
import { GetTotalRam } from "/snailBurner/utility/snailFunctions.js";

*/




export function GetFiles(ns)
{
	//files to be copied to purchased servers, hacknet-servers, nuked servers etc.
	//use this function wherever possible and adjust files here as necessary.
	let files = [
		"/snailBurner/snailBatcher/w.js",
		"/snailBurner/snailBatcher/g.js",
		"/snailBurner/snailBatcher/h.js",
		"/snailBurner/snailBatcher/s.js"
		];
	return files;	
}




export function GetFactions(ns)
{
	let factions = [
		"Illuminati",
		"Daedalus",
		"The Covenant",
		"ECorp",
		"MegaCorp",
		"Bachman & Associates",
		"Blade Industries",
		"NWO",
		"Clarke Incorporated",
		"OmniTek Incorporated",
		"Four Sigma",
		"KuaiGong International",
		"Fulcrum Secret Technologies",
		"BitRunners",
		"The Black Hand",
		"NiteSec",
		"CyberSec",
		"Aevum",
		"Chongqing",
		"Ishima",
		"New Tokyo",
		"Sector-12",
		"Volhaven",
		"Speakers for the Dead",
		"The Dark Army",
		"The Syndicate",
		"Silhouette",
		"Tetrads",
		"Slum Snakes",
		"Tian Di Hui",
		"Bladeburners",
		"Church of the Machine God",
		"Shadows of Anarchy"
	];
	return factions;
}




export function GetAugments(ns) 
{
	//uses GetFactions.
	let myFactions = GetFactions(ns);
	let myAugments = [];
	let myArray;
	for (let i = 0; i < myFactions.length; i++)
	{
		myArray = ns.singularity.getAugmentationsFromFaction(myFactions[i]);
		for (let j = 0; j < myArray.length; j++)
		{
			if (!myAugments.includes(myArray[j]))
			{
				myAugments.push(myArray[j]);
			}
		}
	}
	return myAugments;
}




export function CopyFiles(ns, server)
{
	//uses GetFiles
	//copies files to a single server.
	let files = GetFiles(ns);
	let newFiles = [];
	let tempFile = [];

	// makes a newFiles array with the file paths removed.
	//eg. array with w.js, g.js, h.js
	for (let i = 0; i < files.length; i++)
	{
		if(files[i].includes("/"))
		{
			tempFile = files[i].split("/");
			newFiles.push(tempFile[(tempFile.length - 1)]);
		}
	}
	// copies files to the server and renames it with mv to remove file path.
	//eg. puts w.js, g.js, h.js on purchased server but not in directories. 
	ns.scp(files, server, "home");
	for (let i = 0; i < files.length; i++)
	{
		ns.mv(server, files[i], newFiles[i])
	}		
}




export function BuyServer(ns, size)
{
	//uses CopyFiles function.
	let servers = ns.getPurchasedServers();
	let name = "";
	let names = [
		"home-00",
		"home-01",
		"home-02",
		"home-03",
		"home-04",
		"home-05",
		"home-06",
		"home-07",
		"home-08",
		"home-09",
		"home-10",
		"home-11",
		"home-12",
		"home-13",
		"home-14",
		"home-15",
		"home-16",
		"home-17",
		"home-18",
		"home-19",
		"home-20",
		"home-21",
		"home-22",
		"home-23",
		"home-24"
	];

	if (!(servers.length > 0 && servers.length <= ns.getPurchasedServerLimit()))
	{
		name = names[0];
	}
	else if (!(servers.length == ns.getPurchasedServerLimit()))
	{
		name = names[servers.length]
	}
	ns.purchaseServer(name, size);
	CopyFiles(ns, name);
}




export async function BuyTor(ns) 
{
	if (!(ns.hasTorRouter()))
	{
		while (ns.getServerMoneyAvailable("home") < 200000)
		{
			await ns.sleep(250);
		}
		ns.singularity.purchaseTor();
	}	
}




export async function BuyBrute(ns) 
{
	if (!ns.fileExists("BruteSSH.exe"))
	{
		while (ns.getServerMoneyAvailable("home") < 500000)
		{
			await ns.sleep(100);
		}
		ns.singularity.purchaseProgram("BruteSSH.exe");	
	}	
}




export function GetServers(ns)
{
	let serverList = ns.scan("home");
	let newScan = [];
	let scanCount = 25;
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
	return serverList;
}




export function GetHacknetServers(ns)
{
	//returns hacknetServerList
	//uses GetServers function.
	let serverList = GetServers(ns)
	let hacknetServerList = [];
	for (let i = 0; i < serverList.length; ++i)
	{
		if (serverList[i].includes("hacknet"))
		{
			hacknetServerList.push(serverList[i]);
		}
	}
	return hacknetServerList;
}




export function GetShortenedServerList(ns)
{
	//returns shortenedServersList
	//this is serverList minus home, darkweb, purchased servers and hacknet servers.
	//this will be used in the functions that make ramServers and cashServers.
	//uses GetServers function.
	//uses GetHacknetServers function.
	let serverList = GetServers(ns);
	let hacknetServersList = GetHacknetServers(ns);
	let purchasedServers = ns.getPurchasedServers();
	let shortenedServersList = [];
	//making shortenedServersList from serverList
	for (let i = 0; i < serverList.length; ++i)
	{
		shortenedServersList.push(serverList[i]);
	}
	//removing home.
	shortenedServersList.splice(shortenedServersList.indexOf("home"), 1);
	//removing darkweb.
	if (shortenedServersList.includes("darkweb"))
	{
		shortenedServersList.splice(shortenedServersList.indexOf("darkweb"), 1);
	}
	//removing purchased servers. 
	for (let i = 0; i < purchasedServers.length; i++)
	{
		for (let j = 0; j < shortenedServersList.length; j++)
		{
			if (purchasedServers[i] == shortenedServersList[j])
			{
				shortenedServersList.splice(j, 1);
			}
		}
	}
	//removing hacknet servers.
	for (let i = 0; i < hacknetServersList.length; i++)
	{
		for (let j = 0; j < shortenedServersList.length; j++)
		{
			if (hacknetServersList[i] == shortenedServersList[j])
			{
				shortenedServersList.splice(j, 1);
			}
		}
	}
	return shortenedServersList;
}




export function GetRamServersPlease(ns)
{
	//returns ramServers
	//this is the hacked servers with RAM
	//uses GetShortenedServerList
	let servers = GetShortenedServerList(ns);
	let ramServers = [];
	for (let i = 0; i < servers.length; i++)
	{
		if (ns.getServerMaxRam(servers[i]) > 0)
		{
			ramServers.push(servers[i]);
		}
	}
	return ramServers;
}




export function GetCashServersPlease(ns)
{
	//returns cashServers
	//uses GetShortenedServerList
	let cashServers = GetShortenedServerList(ns);
	for (let i = 0; i < cashServers.length; i++)
	{
		if (ns.getServerMaxMoney(cashServers[i]) == 0)
		{
			cashServers.splice(i, 1);
		}
	}
	return cashServers;
}

export function GetTopServer(ns)
{
	//returns topServer
	//top server is the server with the largest maximum cash
	//uses GetCashServersPlease
	let servers = GetCashServersPlease(ns);
	let topDollar = 0;
	let topServer;
	for (let i = 0; i < servers.length; ++i)
	{
		if (ns.getServerMaxMoney(servers[i]) > topDollar)
		{
			topDollar = ns.getServerMaxMoney(servers[i]);
			topServer = servers[i];
		}
	}
	return topServer;
}


export function GetTargets(ns)
{
	//returns targets
	//this is cash servers that are in level range to hack
	//uses GetCashServersPlease.
	//returns array of server objects.
	let cashServers = GetCashServersPlease(ns);
	let targets =[];
	let player = ns.getPlayer();
	for (let i = 0; i < cashServers.length; i++)
	{
		if (player.skills.hacking > ns.getServerRequiredHackingLevel(cashServers[i]))
		{
			targets.push(ns.getServer(cashServers[i]));
		}
	}
	return targets;
}




export function GetServersWithRootPlease(ns)
{
	//returns rootedServers
	//uses getRamServersPlease
	let servers = GetRamServersPlease(ns);
	let rootedServers = [];
	for (let i = 0; i < servers.length; i++)
	{
		if (ns.hasRootAccess(servers[i]))
		{
			rootedServers.push(servers[i]);
		}
	}
	return rootedServers;
}




export function GetUsableServers(ns)
{
	let rootedServers = GetServersWithRootPlease(ns);
	let purchasedServers = ns.getPurchasedServers();
	let myHacknetServers = GetHacknetServers(ns);
	let usableServers = rootedServers;

	for (let i = 0; i < purchasedServers.length; i++)
	{
		usableServers.push(purchasedServers[i]);
	}
	for (let i = 0; i < myHacknetServers.length; i++)
	{
		usableServers.push(myHacknetServers[i]);
	}
	return usableServers;
}




export function GetTotalRam(ns)
{
	//returns totalRam
	//uses GetUsableServers
	let totalRam = 0;
	let servers = GetUsableServers(ns);

	for (let i = 0; i < servers.length; i++)
	{
		totalRam = totalRam + ns.getServerMaxRam(servers[i]);
	}
	return totalRam;
}



export async function main(ns) 
{
	ns.tprint("Don't run this.");
}


