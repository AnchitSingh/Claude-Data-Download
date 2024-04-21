// Global list to store data from API requests
let dataList = [];

// Function to extract cookie value by name
function getCookieValue(cookieName) {
    // Split document.cookie string into individual cookies
    const cookies = document.cookie.split(';');

    // Loop through each cookie to find the one with the specified name
    for (let cookie of cookies) {
        // Trim any whitespace
        cookie = cookie.trim();

        // Check if the cookie starts with the specified name
        if (cookie.startsWith(`${cookieName}=`)) {
            // Extract and return the cookie value
            return cookie.substring(cookieName.length + 1);
        }
    }

    // If the cookie with the specified name is not found, return null
    return null;
}

// Usage example: Extract the value of the "lastActiveOrg" cookie
const lastActiveOrgValue = getCookieValue('lastActiveOrg');


// Function to make a GET request to the API
async function fetchData(uuid) {
    try {
        const response = await fetch(`https://claude.ai/api/organizations/${lastActiveOrgValue}/chat_conversations/${uuid}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Data fetched for uuid", uuid)
        dataList.push(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to fetch the key-value pair list from the API
async function fetchKeyValuePairList() {
    try {
        const response = await fetch(`https://claude.ai/api/organizations/${lastActiveOrgValue}/chat_conversations`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching key-value pair list:', error);
        return [];
    }
}

// Function to iterate through the list of key-value pair objects and fetch data
async function fetchDataList(dataList) {
    for (let item of dataList) {
        await fetchData(item.uuid);
    }
}

// Call the function to fetch the key-value pair list and then fetch data for each uuid
fetchKeyValuePairList()
    .then(keyValuePairList => {
        fetchDataList(keyValuePairList);
    })
    .then(() => {
        // After all data is fetched, download the list as a JSON file
        downloadJSON(dataList, 'dataList.json');
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Function to download data as JSON file
function downloadJSON(data, filename) {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
