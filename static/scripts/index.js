document.getElementById('form').onsubmit = () => {
    const searchTerm = document.getElementById("search").value;
    // Getting the RSS container
    let rssList = document.getElementById('rss');

    /**
     * Parsing the RSS XML response and extracting the title, link, and publication data.
     * Then adding them into a list elements and appending each of the list list elements to an ordered list
     * @param data: Json
     */
    function createResultList(data){
        // Creating a ul element
        let list = document.createElement("ul");

        // Looping over the data elements get the content and add the array content
        // into an li element and appending it to the list element
        for(let i=0; i < data.length; i++){
            let li = document.createElement("li");
            li.innerHTML = `
                            <span>
                                <a href="${data[i][2]}" target="_blank">${data[i][1]}</a> 
                                <cite>${data[i][3]}</cite>
                            </span>
                            <span>
                                ${data[i][0].slice(0,10)}
                            </span>
                               `;
            list.appendChild(li);
        }

        rssList.innerHTML = ""; // Clearing out current content
        rssList.appendChild(list); // appending the new results
    }

    // Here we're making a get request to the server to get the search results for the searched term.
    // The server is making the fetch request the the Google RSS news api and returning an XML result.
    // I chose to parse the data twice using a frontend method and a backend method purely for learning purposes,
    // this this is a test project.
    fetch(`/api/search-term/${searchTerm}`)
        .then(res => res.json())
        .then(data => createResultList(data))
        .catch(error =>{
            console.log(error);
        });
    return false;
};