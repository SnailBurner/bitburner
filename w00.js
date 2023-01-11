/** @param {NS} ns */
// code by SnailBurner.
export async function main(ns)
{
	let target = ns.args[0];
	let x = ns.args[1];
	await ns.weaken(target);
}