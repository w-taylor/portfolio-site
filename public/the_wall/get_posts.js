document.addEventListener('DOMContentLoaded', () => {
    function loadPosts() {
        fetch("get_posts")
            .then(response => response.json())
            .then(data => parsePosts(data))
    };

    function parsePosts(posts){
	console.log('parse');
	console.log(posts);
        if (posts.length == 0){
            //Post some message saying "no posts found"
		console.log("no posts");
            return;
        };
        let toAdd = "";
        for (let x = 0; x < posts.length; x++) {
            toAdd += '<p class="post-body">';
            toAdd += posts[x]['pbody'];
            toAdd += '</p><div class="divider-line"></div>';
        };
        document.querySelector(".posts").innerHTML = toAdd;
    }

    loadPosts();
});
