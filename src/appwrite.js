import { Client, Databases, Query, ID } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// const url = "https://fra.cloud.appwrite.io/v1"

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)
    // .setKey(import.meta.env.VITE_APPWRITE_API_KEY);


const database = new Databases(client);



export const updateSearchCount = async (searchTerm, movie) => {

    try {

        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('searchTerm', searchTerm)
            ]
        );

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1,
                }
            );
            console.log('Document already exists:', result.documents[0]);
            return;
        } else {
            await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: 'https://image.tmdb.org/t/p/w500/' + movie.poster_path,
                }
            );
        }
        // const response = await databases.createDocument(
        //     DATABASE_ID,
        //     COLLECTION_ID,
        //     'unique()',
        //     {
        //         searchTerm: searchTerm,
        //         movie: movie
        //     }
        // );
        // console.log('Document created:', response); 

    } catch (error) {
        console.error('Error creating document:', error);
    }


}


export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.limit(5),
                Query.orderDesc('count'),
            ]
        )
        // console.log('Trending movies: appfhsjkfhk', (await result).documents);
        return result.documents;

    } catch (error) {
        console.error('Error getting trending movies:', error);
        return [];
    }
}