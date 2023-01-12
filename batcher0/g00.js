/** @param {NS} ns */
// code by SnailBurner.
export async function main(ns)
{
	let target = ns.args[0];
	await ns.grow(target);
}