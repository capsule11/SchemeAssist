const { Client, Databases, Query } = require('node-appwrite');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// Logic to categorize based on keywords
const getArea = (name) => {
    const n = name.toLowerCase();
    if (n.includes('kisan') || n.includes('agri') || n.includes('krishi') || n.includes('harvest')) return 'Agriculture';
    if (n.includes('scholarship') || n.includes('vidya') || n.includes('student') || n.includes('school')) return 'Education';
    if (n.includes('health') || n.includes('ayushman') || n.includes('bima') || n.includes('medical')) return 'Health';
    if (n.includes('startup') || n.includes('mudra') || n.includes('msme') || n.includes('business')) return 'Business';
    if (n.includes('woman') || n.includes('mahila') || n.includes('ladli') || n.includes('matru')) return 'Women';
    if (n.includes('pension') || n.includes('senior') || n.includes('vridha') || n.includes('atal')) return 'Seniors';
    return 'General'; // Default
};

async function updateExistingSchemes() {
    console.log("🔍 Fetching existing schemes...");
    let offset = 0;
    const limit = 100;

    while (true) {
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_ID,
            [Query.limit(limit), Query.offset(offset)]
        );

        if (response.documents.length === 0) break;

        for (const doc of response.documents) {
            const assignedArea = getArea(doc.schemeName);
            await databases.updateDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_COLLECTION_ID,
                doc.$id,
                { area: assignedArea }
            );
            console.log(`Updated: ${doc.schemeName} -> ${assignedArea}`);
        }
        offset += limit;
    }
    console.log("✅ All schemes updated with Area tags!");
}

updateExistingSchemes();