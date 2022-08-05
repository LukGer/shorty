import { prisma } from '../lib/database/client';
import { variables } from '$lib/variables';
import HashIds from 'hashids';

export async function POST({ request }) {
	var url: string = await request.text();

	const hashIds = new HashIds(variables.hashIdsSalt);

	var existingShortlink = await prisma.shortLink.findFirst({
		where:{
			url: {
				equals: url
			}
		}
	});

	if(existingShortlink){
		return {
			status: 200,
			body: {
				id: hashIds.encode(existingShortlink!.id)
			}
		};
	}

	var newShortlink = await prisma?.shortLink.create({
		data: {
			url
		}
	});

	if (newShortlink) {
		return {
			status: 200,
			body: {
				id: hashIds.encode(newShortlink!.id)
			}
		};
	}

	return {
		status: 500,
		body: {
			error: "Shortlink could not be created."
		}
	};
}
