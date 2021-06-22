document.addEventListener('DOMContentLoaded', () => {
    let submitbtn = document.querySelector(".submit");
    let newpost = document.querySelector(".new-entry");

    function sendPost() {
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
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data);
        })
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
