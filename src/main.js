const API_URL_RAMDOM = 'https://api.thecatapi.com/v1/images/search?limit=3';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
const API_KEY = 'live_NzL6iOJnvucvbwSzGp2XagmbNKwn5sBX5SWiRmbpLBR9SIv8ONgqdanYuuhQkDiO';

const spanError = document.getElementById('error');

async function loadRamdomMichis() {
    const res = await fetch(API_URL_RAMDOM, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY,
        }
    });
    const data = await res.json();
    console.log('ramdom');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = 'Hubo un error: ' + res.status + ' ' + data.message;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const btnGuardar1 = document.getElementById('btnGuardar1');
        const btnGuardar2 = document.getElementById('btnGuardar2');
        const btnGuardar3 = document.getElementById('btnGuardar3');

        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;

        btnGuardar1.onclick = () => saveFavoriteMichi(data[0].id);
        btnGuardar2.onclick = () => saveFavoriteMichi(data[1].id);
        btnGuardar3.onclick = () => saveFavoriteMichi(data[2].id);
    }
}

async function loadFavoriteMichis() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY,
        }
    });
    const data = await res.json();
    console.log('favorites');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerText = 'Hubo un error: ' + res.status;
    } else {
        const div = document.getElementById('favoriteMichis');
        div.classList.add('container-img');
        div.innerHTML = "";
        data.forEach(michi => {
            const article = document.createElement('article');
            article.classList.add('article-img');
            const img = document.createElement('img');
            img.classList.add('img');
            const btn = document.createElement('button');
            btn.classList.add('fav-btn');
            const btnText = document.createTextNode('Eliminar de favoritos');

            img.src = michi.image.url;
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavoriteMichi(michi.id);
            article.appendChild(img);
            article.appendChild(btn);
            div.appendChild(article);

            // michi.image.url
        });
    }
    
}

async function saveFavoriteMichi(id) {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        body: JSON.stringify({
            image_id: id,
        })
    });

    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerText = 'Hubo un error: ' + res.status;
    } else {
        console.log('Michi guardado en favoritos');
        loadFavoriteMichis();
    }

    console.log(res);
}

async function deleteFavoriteMichi(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': API_KEY,
        }
    });

    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerText = 'Hubo un error: ' + res.status;
    } else {
        console.log('Michi eliminado de favoritos');
        loadFavoriteMichis();
    }
}

async function uploadMichiPhoto() {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'x-api-key': API_KEY,
        },
        body: formData,
    });

    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerText = 'Hubo un error: ' + res.status;
        console.log(data);
    } else {
        console.log('Foto de michi subida');
        console.log({data});
        console.log(data.url);
        saveFavoriteMichi(data.id);
        form.reset();
    }
}

loadRamdomMichis();
loadFavoriteMichis();
