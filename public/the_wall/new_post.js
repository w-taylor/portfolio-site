document.addEventListener('DOMContentLoaded', () => {
    let submitbtn = document.querySelector(".submit");
    let newpost = document.querySelector(".new-entry");

    function sendPost() {
        const data = {"newpost":newpost.value};

        fetch('wall', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data);
        })
        .catch((error) => {
        console.error('Error:', error);
        });
    };

    submitbtn.onclick = sendPost;
});