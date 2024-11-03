// Variables y constantes
const tweetForm = document.getElementById('tweetForm');
const tweetInput = document.getElementById('tweetInput');
const tweetsContainer = document.getElementById('tweetsContainer');
const loadTweetsButton = document.getElementById('loadTweetsButton');
const tweets = JSON.parse(localStorage.getItem('tweets')) || [];

// Función para renderizar los tweets
function renderTweets() {
    tweetsContainer.innerHTML = '';
    tweets.forEach((tweet, index) => {
        const tweetElement = document.createElement('div');
        tweetElement.classList.add('tweet');
        tweetElement.innerHTML = `
            <p>${tweet.content}</p>
            <div class="tweet-time">${new Date(tweet.time).toLocaleString()}</div>
            <button onclick="deleteTweet(${index})">Eliminar</button>
        `;
        tweetsContainer.appendChild(tweetElement);
    });
}

// Función para agregar un tweet
function addTweet(event) {
    event.preventDefault();
    const content = tweetInput.value.trim();

    if (content === '') {
        Swal.fire('Error', 'El tweet no puede estar vacío', 'error');
        return;
    }

    const tweet = {
        content: content,
        time: new Date().toISOString(),
    };

    tweets.unshift(tweet); // Agregar el nuevo tweet al principio del array
    localStorage.setItem('tweets', JSON.stringify(tweets)); // Guardar en storage
    tweetInput.value = '';
    renderTweets();
}

// Función para eliminar un tweet
function deleteTweet(index) {
    tweets.splice(index, 1);
    localStorage.setItem('tweets', JSON.stringify(tweets));
    renderTweets();
}

// Función para cargar tweets desde una API externa
async function loadExternalTweets() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const data = await response.json();
        data.forEach(post => {
            const tweet = {
                content: post.title,
                time: new Date().toISOString(),
            };
            tweets.push(tweet);
        });
        localStorage.setItem('tweets', JSON.stringify(tweets));
        renderTweets();
        Swal.fire('Éxito', 'Tweets cargados correctamente', 'success');
    } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar los tweets externos', 'error');
    }
}

// Evento para enviar el formulario
tweetForm.addEventListener('submit', addTweet);

// Evento para cargar tweets externos
loadTweetsButton.addEventListener('click', loadExternalTweets);

// Renderizar los tweets al cargar la página
renderTweets();