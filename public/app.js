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
                <li>${band.member1}</li>
                <li>${band.member2}</li>
                <li>${band.member3}</li>
                <li>${band.member4}</li>
            </ul>
        </div>
        `);
        });
    });
});
