import { prisma } from '../lib/database/client';
import { variables } from '$lib/variables';
import HashIds from 'hashids';

export async function GET({ params }) {
	const hashIds = new HashIds(variables.hashIdsSalt);

	const hashId = params.id;

	const id = Number(hashIds.decode(hashId)[0]);

	const shortLink = await prisma.shortLink.findFirst({
		where: {
			id: {
				equals: id
			}
		}
	});

	if (shortLink?.url) {
		return {
			status: 303,
			headers: {
				Location: shortLink?.url
			}
		};
	}

	return {
		status: 404,
		body: 'No shortlink found'
	};
}
