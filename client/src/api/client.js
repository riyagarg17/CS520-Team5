const fetchClient = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch Client Error:", error.message);
        throw error;
    }
};

export default fetchClient;
