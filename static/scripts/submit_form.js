document.getElementById('form').onsubmit = () => {
    const searchTerm = document.getElementById("search").value;

    /**
     * Parsing the RSS XML response and extracting the title, link, and publication data.
     * Then adding them into a list elements and appending each of the list list elements to an ordered list
     * @param xml
     */
    function createResultList(xml){
        let items = xml.getElementsByTagName('item');
        let list = document.getElementById("list");
        for(let i=0; i < items.length; i++){
            let li = document.createElement("li");
            let title = items[i].querySelector('title').textContent;
            let link = items[i].querySelector('link').textContent;
            let pubDate = items[i].querySelector('pubDate').textContent;
            li.innerHTML = `<span><a href="${link}" target="_blank">${title}</a></span><span>${pubDate}</span>`;
            list.appendChild(li);
        }
    }

    // Here we're making a get request to the server to get the search results for the searched term.
    // The server is making the fetch request the the Google RSS news api and returning an XML result.
    // I chose to parse the data twice using a frontend method and a backend method purely for learning purposes,
    // this this is a test project.
    fetch(`/api/search-term/${searchTerm}`)
        .then(res => res.text())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, 'application/xml');
            createResultList(xml);
        })
        .catch(error =>{
            console.log(error);
        });
    return false;
};