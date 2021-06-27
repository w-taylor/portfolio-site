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
        let entry = "";
        for (let x = 0; x < posts.length; x++) {
            entry = '<p class="post-body">';
            posts[x]['pbody'] = posts[x]['pbody'].replace("\n","&#10;");
            entry += posts[x]['pbody'];
            entry += '</p><div class="divider-line"></div>';
            toAdd = entry + toAdd;
        };
        document.querySelector(".posts").innerHTML = toAdd;
    }

    loadPosts();
});
