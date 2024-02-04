/** @param {NS} ns */
// code by SnailBurner.
export async function main(ns)
{
	let target = ns.args[0];
	let threadCount = ns.args[1];			//integer between 1 and the amout of threads the script is run with
	let pump = ns.args[2]; 						//true or false to rig the market 
	let delay = ns.args[3];						//in ms
	await ns.grow(target, {threads: threadCount, stock: pump, additionalMsec: delay});
}
