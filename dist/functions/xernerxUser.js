/** @format */
export async function xernerxUser(event, client) {
	const author = event.author || event.user;
	author.owner = isOwner(client, author);
	if (client.dbl.validate) author.voted = await client?.dbl?.validate(author);
	return author;
}
function isOwner(client, user) {
	return client.settings.ownerId.includes(user.id);
}
