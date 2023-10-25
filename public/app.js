const bandInfo = document.querySelector("#band-info");

await fetch("fst/band").then((response) => {
    response.json().then((data) => {
        data.forEach((element) => {
            const band = document.createElement("div");
            band.classList.add("band");
            const bandName = document.createElement("p");
            const genre = document.createElement("p");
            bandName.textContent = element.name;
            genre.textContent = element.genre;
            band.appendChild(bandName);
            band.appendChild(genre);
            bandInfo.appendChild(band);
        });
    });
});
