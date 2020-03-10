function bootstrapAlert(type, msg){
    return `
                <div class="alert alert-${type} alert-dismissible fade show error-msg hidden" role="alert" id="msgBlock">
                    ${msg}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `
}

function userRegister() {
    const registrationForm = document.getElementById('userRegistration');
    const formData = new FormData(registrationForm);  // Get form data
    const formEntries = Object.fromEntries(formData); // Get form entries from form data
    let validForm = true;

    // Reset error messages
    document.querySelectorAll('.error-msg').forEach(msg => {
        msg.innerHTML = "";
    });

    // Posting form data once if the form is valid
    if(validForm){
        fetch('/users/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formEntries)
        })
            .then(res => res.json())
            .then(result => {
                if(result.errors){
                    console.log(result);
                    // Loop through the errors and display them on the page in their respective elements
                    for(let [errKey, errValue] of Object.entries(result)){
                        if(errKey !== 'errors' && errKey !== 'registered' && errValue){
                            document.getElementById(String(errKey)).innerHTML = String(errValue);
                        }
                        if(result.registered){
                            let msgBlock = document.getElementById('msgBlock');
                            msgBlock.innerHTML = bootstrapAlert('warning', 'This email is already registered');
                        }
                    }
                }else{
                    // If the user is created without an issue the API will return a redirect
                    // path to redirect to.
                    if(result.redirect)
                        window.location = result.redirect
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    return false;
}

