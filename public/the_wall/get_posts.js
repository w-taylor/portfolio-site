document.addEventListener('DOMContentLoaded', () => {
    return;
    function loadPosts() {
        fetch("wall/main")
            .then(response => response.json)
            .then(data => parsePosts(data))
    };

    function parsePosts(data){
        let posts = data.posts; //Access post text bodies fetched from database
        if (posts.length == 0){
            //Post some message saying "no posts found"
            return;
        };
        let toAdd = "";
        for (let x = 0; x > posts.length; x++) {
            toAdd += '<p class="post-body">';
            toAdd += posts[x];
            toAdd += '</p><div class="divider-line"></div>';
        };
        document.querySelector(".posts").innerHTML = toAdd;
    }

    loadPosts();
};