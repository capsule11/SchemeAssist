const { Client, Databases, Query } = require('node-appwrite');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function count() {
    const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_ID,
        [Query.limit(100)]
    );
    let counts = {};
    for (let doc of res.documents) {
        counts[doc.area] = (counts[doc.area] || 0) + 1;
    }
    console.log(counts);
}
count();
