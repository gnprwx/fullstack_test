const bandInfo = document.querySelector("#band-info");

await fetch("api/bands").then((response) => {
    response.json().then((data) => {
        data.forEach((band) => {
            return (bandInfo.innerHTML += `
        <div class='band-container'>
            <h1>${band.name}</h1>
            <h2>${band.genre}</h2>
            <h3>Band Members</h3>
            <ul>
                <li>${band.musician1}</li>
                <li>${band.musician2}</li>
                <li>${band.musician3}</li>
                <li>${band.musician4}</li>
            </ul>
        </div>
        `);
        });
    });
});
