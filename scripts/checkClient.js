const { Client, Databases, Query } = require('appwrite');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

async function checkClientData() {
    const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID,
        [Query.limit(5)]
    );
    console.log("Docs:", res.documents.map(d => ({ name: d.schemeName, area: d.area })));
}
checkClientData();
