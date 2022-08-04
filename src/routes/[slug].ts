import { prisma } from '../lib/database/client';

export async function GET({ params }) {
	const slug = params.slug;

	const shortLink = await prisma.shortLink.findFirst({
		where: {
			hash: {
				equals: slug
			}
		}
	});    

    if(shortLink?.url){
        return {
            status: 303,
            headers: {
                Location: shortLink?.url
            }
        }
    }

    return {
        status: 404,
        body: "No shortlink found"
    }
}
