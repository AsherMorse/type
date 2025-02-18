import { Client, Account, Databases } from "appwrite";

const APPWRITE_ENDPOINT = import.meta.env.PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.PUBLIC_APPWRITE_PROJECT_ID;

if (!APPWRITE_PROJECT_ID) {
  console.error('Missing PUBLIC_APPWRITE_PROJECT_ID environment variable');
}

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client); 