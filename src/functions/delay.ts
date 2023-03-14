export default async function delay(time: number) {
    return await new Promise((resolve) => setTimeout(resolve, time));
}
