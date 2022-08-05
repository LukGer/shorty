import { prisma } from '../lib/database/client';
import { variables } from "$lib/variables";
import HashIds from 'hashids';

export async function POST({ request }) {
	var url = await request.text();

	const hashIds = new HashIds(variables.hashIdsSalt);

	var shortlink = await prisma?.shortLink.create({
		data: {
			url
		}
	});

	if (shortlink !== null) {
		return {
			status: 200,
			body: {
				id: hashIds.encode(shortlink!.id)
			}
		};
	}

	return {
		status: 500
	};
}
