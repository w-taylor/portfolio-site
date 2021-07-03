document.addEventListener('DOMContentLoaded', () => {
    let submitbtn = document.querySelector(".submit");
    let newpost = document.querySelector(".new-entry");

    function sendPost() {
        //Reject post if it is over 2000 characters long
	    if (newpost.value.length > 2000) {
		    tooLong(parseInt(newpost.value.length));
		    return;
	    };
        const data = {"newpost":newpost.value};
        fetch('new_post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(() => {location.replace("http://wtaylor.xyz/wall/main")})
        .catch((error) => {
            console.error('Error:', error);
        });
    };

	function tooLong(curr) {
		let toAdd = "Input is too long! ";
		toAdd += curr;
		toAdd += "/2000 characters";
		document.querySelector(".too-long").innerHTML = toAdd;
    };

    submitbtn.onclick = sendPost;
});
