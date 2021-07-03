document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector(".submit");
    let fromName = document.querySelector(".from-name");
    let fromAddress = document.querySelector(".from-address");
    let mesSubject = document.querySelector(".mes-subject");
    let message = document.querySelector(".message");

    function postMail() {
        const fields = [fromName,fromAddress,mesSubject,message];
        //Quit function if any form fields are empty
        for (let x = 0; x < fields.length; x++) {
            if (fields[x].value === "") {
                document.querySelector(".mail-error").innerHTML = "Please fill out all fields";
                return;
            }
        }
        const data = {
            "fromName" : fromName.value,
            "fromAddress" : fromAddress.value,
            "mesSubject" : mesSubject.value,
            "message" : message.value
        };
        fetch( 'send_mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
        //console.log('Success:', data);
        })
        .catch((error) => {
        //console.error('Error:', error);
        });
        document.querySelector(".mail-error").innerHTML = "";
        document.querySelector(".mail-success").innerHTML = "Message sent!";
        //Disable submit button after mail successfully sent
        submitBtn.onclick = "";
    };

    submitBtn.onclick = postMail;
})
