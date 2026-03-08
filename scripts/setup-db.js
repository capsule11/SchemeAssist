import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
// NOTE: Node Appwrite requires an API Key for admin tasks (creating collections)
// Since we don't have one in the template, this script is a guide.
// The user has to manually create the Database and Collections in the Appwrite Console.
const apiKey = process.env.APPWRITE_API_KEY; 

client
  .setEndpoint(endpoint)
  .setProject(projectId || '')
  .setKey(apiKey || '');

const databases = new Databases(client);

async function setup() {
  if (!apiKey) {
    console.log("⚠️ APPWRITE_API_KEY is missing from .env. You must create the databases manually, or add the API KEY to run this script.");
    console.log("Required Setup in Appwrite Console:\n");
    console.log("1. Create Database named 'schemeassist'");
    console.log("2. Create Collection 'schemes' with attributes: schemeName(String), benefitsSummary(String), eligibilitySummary(String), implementingMinistry(String), officialWebsite(URL).");
    console.log("3. Create Collection 'profiles' with attributes: userId(String), name(String), email(String), gender(String), age(Integer), state(String), etc.");
    console.log("4. Ensure Permissions on BOTH collections are set to Role: 'Any' -> Create, Read, Update, Delete for testing.");
    return;
  }
  console.log("Starting DB Setup...");
}

setup();
