import got from 'got';

const dataURL = 'https://dev-srjc-fall-2025-cs-55-13.pantheonsite.io/wp-json/twentytwentyone-child/v1/latest-posts/1';

// Helper function to fetch and parse post data
async function fetchPosts() {
    try {
        const response = await got(dataURL);
        return JSON.parse(response.body);
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array on error
    }
}

// Function to get all posts data, sorted by title.
export async function getSortedPostsData() {
    const jsonObj = await fetchPosts();

    // Sort the posts alphabetically by their title.
    jsonObj.sort((a, b) => a.post_title.localeCompare(b.post_title));

    // Map over the sorted objects to return a consistent structure.
    return jsonObj.map(item => ({
        id: item.ID.toString(),
        title: item.post_title,
        date: item.post_date.replace(' ', 'T'),
        author: item.post_author,
    }));
}

// Function to get all post IDs for dynamic routing.
export async function getAllPostIds() {
    const jsonObj = await fetchPosts();

    // Map over the posts to return an array of objects with 'params.id'.
    return jsonObj.map(item => ({
        params: {
            id: item.ID.toString(),
        },
    }));
}

// Function to get data for a single post by its ID.
export async function getPostData(id) {
    const jsonObj = await fetchPosts();
    const foundObj = jsonObj.find(obj => obj.ID.toString() === id);

    if (!foundObj) {
        return {
            id: id,
            title: 'Not found',
            date: '',
            post_content: 'Post not found'
        };
    }

    // If a post is found, return a formatted object.
    return {
        id: foundObj.ID.toString(),
        title: foundObj.post_title,
        date: foundObj.post_date.replace(' ', 'T'),
        author: foundObj.post_author,
        post_content: foundObj.post_content
    };
}