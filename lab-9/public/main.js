console.log('works');

updatePosts();

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function updatePosts() {
    const container = document.getElementById('container');

    fetch('http://localhost:3001/posts', {
        method: 'GET',
        credentials: "same-origin"
    }).then(res => res.json())
    .then(res => {
        const comments = res.map(item => {
            const p = document.createElement('p');
            p.innerText = `${item.name}: ${item.content}`;
            return p;
        });

        removeAllChildNodes(container);
        comments.forEach(comment => {
            container.appendChild(comment);
        })
    });
}

function login() {
    fetch('http://localhost:3001/login', {
        method: 'POST',
        credentials: "same-origin",
    }).then(res => console.log(res))
}

function post() {
    const textContainer = document.getElementById('comment-text');
    const value = textContainer.value;

    fetch('http://localhost:3001/post', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: value
        })
    }).then(res => {
        textContainer.value = '';
        updatePosts();
    })
}
