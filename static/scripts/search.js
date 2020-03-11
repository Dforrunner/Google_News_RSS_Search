// Initializing a global object variable that will store the latest search results
// This will allow us to get object data by their index
let currentRssListData = {};

function saveArticle(index) {

    // Make fetch request to save data
    fetch('/article/save-article', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentRssListData[index])
    })
        .then(res => res.json())
        .then(result => {
            if(result.success){
                // If an article from the search result list is saved, then the button
                // styling and functions change to indicate new change and allow
                // for removal of article using the same button.
                const btn = document.getElementById(`btnIndex-${index}`);
                btn.classList.remove('btn-info');
                btn.classList.add('btn-success');
                btn.innerHTML = 'Saved';
                btn.setAttribute('data-articleID', result.articleID);
                btn.setAttribute('onclick', 'return deleteArticleChangeBtn(this)')
            }
        })
        .catch(error => {
            console.log(error);
        });
    return false;
}

function deleteArticle(articleID) {

    // Make fetch request to delete data
    fetch(`/article/delete-article/${articleID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(result => {
            if(result.success){
                // In the profile page this removed the list item from the DOM if the item was successfully deleted from DB
                const listItem = document.getElementById(`listIndex-${articleID}`);
                listItem.classList.add('remove');
                setTimeout(() => {
                    listItem.parentNode.removeChild(listItem);
                }, 400);
            }
        })
        .catch(error => {
            console.log(error);
        });
    return false;
}

// This function removed article and changes the button back to unsaved style
function deleteArticleChangeBtn(btn) {

    // Get article id and call delete function
    const articleID = btn.getAttribute("data-articleID");
    deleteArticle(articleID);

    // Change button style to indicate the article is no longer saved
    btn.classList.remove('btn-success');
    btn.classList.add('btn-info');
    btn.innerHTML = 'Save';
    btn.setAttribute('onclick', "saveArticle(this.getAttribute('data-articleIndex'))");
}

function searchForm() {
    const searchTerm = document.getElementById("search").value;
    // Getting the RSS container
    let rssList = document.getElementById('rss');

    /**
     * Parsing the RSS XML response and extracting the title, link, and publication data.
     * Then adding them into a list elements and appending each of the list list elements to an ordered list
     * @param data: Json
     * @param isAuthenticated
     * @param userID
     */
    function createResultList(data, isAuthenticated, userID){
        // Creating a ul element
        let list = document.createElement("ul");

        // Looping over the data elements get the content and add the array content
        // into an li element and appending it to the list element
        for(let i=0; i < data.length; i++){

            // Destructing data into more easy to read variables
            let {title, href, source, pubDate, guid} = {
                pubDate: data[i][0],
                title: data[i][1],
                href: data[i][2],
                source: data[i][3],
                guid: data[i][4]
            };

            // Adding each search result into the global currentRssListData variable
            currentRssListData[i] = [pubDate, title, href, source, guid, userID];

            let li = document.createElement("li");

            // Save button will trigger a bootstap modal if the user is not authenticated
            // Otherwise it will save the article
            const buttonIfAuth = `<button class="btn btn-info" data-articleIndex='${i}' id="btnIndex-${i}" onclick="return saveArticle(this.getAttribute('data-articleIndex'))"> Save </button>`;
            const buttonIfNotAuth = `<button type="button" class="btn btn-info" data-toggle="modal" data-target="#LoginModal">Save</button>`;
            const button = isAuthenticated? buttonIfAuth : buttonIfNotAuth;

            li.innerHTML = `<span>
                                ${button}
                                <a href="${href}" target="_blank">${title}</a> 
                                <cite>${source}</cite>
                            </span>
                            <span>${pubDate.slice(0,10)}</span>`;

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
        .then(data => createResultList(data.values, data.isAuthenticated, data.userID))
        .catch(error =>{
            console.log(error);
        });
    return false;
}