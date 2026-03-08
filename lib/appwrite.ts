import { Client, Account, Databases, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);

// Environment Variable Helpers
const DB_ID = process.env.NEXT_PUBLIC_DATABASE_ID || '';
const SCHEMES_COLLECTION_ID = process.env.NEXT_PUBLIC_COLLECTION_ID || '';
const PROFILES_COLLECTION_ID = process.env.NEXT_PUBLIC_PROFILE_COLLECTION_ID || 'profiles'; // Fallback if not provided initially

// --- Auth Functions ---

export const signupUser = async (email: string, password: string, name: string) => {
    try {
        // First check if a session is already active
        const currentUser = await getCurrentUser();
        if (currentUser) {
            // Already logged in
            return currentUser;
        }

        const userAccount = await account.create(ID.unique(), email, password, name);
        if (userAccount) {
            return await loginUser(email, password);
        }
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        // First check if a session is already active
        const currentUser = await getCurrentUser();
        if (currentUser) {
            return currentUser;
        }

        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        console.error("Error getting current user", error);
        return null; // Return null instead of throwing for auth state checks
    }
};

export const logoutUser = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error("Error logging out", error);
        throw error;
    }
};


// --- Database Functions ---

export const getUserProfile = async (userId: string) => {
    try {
        const response = await databases.listDocuments(
            DB_ID,
            PROFILES_COLLECTION_ID,
            [Query.equal('userId', userId)]
        );
        return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
        console.error("Error fetching profile", error);
        return null;
    }
};

export const createOrUpdateProfile = async (userId: string, profileData: any) => {
    try {
        const existingProfile = await getUserProfile(userId);
        
        // Ensure userId is in the document data
        const dataToSave = { ...profileData, userId };

        if (existingProfile) {
            // Update
            return await databases.updateDocument(
                DB_ID,
                PROFILES_COLLECTION_ID,
                existingProfile.$id,
                dataToSave
            );
        } else {
            // Create
            return await databases.createDocument(
                DB_ID,
                PROFILES_COLLECTION_ID,
                ID.unique(),
                dataToSave
            );
        }
    } catch (error) {
        console.error("Error saving profile", error);
        throw error;
    }
};

export const deleteUserProfile = async (userId: string) => {
    try {
        // 1. Delete the profile document from the Database
        const existingProfile = await getUserProfile(userId);
        if (existingProfile) {
            await databases.deleteDocument(
                DB_ID,
                PROFILES_COLLECTION_ID,
                existingProfile.$id
            );
        }
        
        // 2. Delete the user's Auth Account entirely
        // Wait, regular client SDK does not let users delete their own auth account without elevated scopes or specific permission setups usually.
        // Actually, Appwrite Client SDK allows `account.updateStatus()` to block, but `account.delete()` doesn't exist on Client API (only Server API).
        // Let's delete the database document and delete their current session to "log them out". If they want true account deletion, Server SDK is needed.
        // For a frontend-only app, deleting the profile document is the best we can do for "deleting data".
        
        // As a workaround, we will delete their data entirely, then log them out.
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error("Error deleting profile data", error);
        throw error;
    }
};

export const fetchAllSchemes = async () => {
    try {
        let allSchemes: any[] = [];
        let offset = 0;
        const limit = 100;

        while (true) {
            const response = await databases.listDocuments(
                DB_ID,
                SCHEMES_COLLECTION_ID,
                [
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );

            allSchemes = [...allSchemes, ...response.documents];

            // If the latest fetch returns less than the limit, we've reached the end
            if (response.documents.length < limit) {
                break;
            }

            offset += limit;
        }
        
        return allSchemes;
    } catch (error) {
        console.error("Error fetching schemes", error);
        return [];
    }
};
