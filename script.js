const filter = document.querySelector('#filter');
const thead = document.querySelector('#thead');
thead.innerHTML = `
    <tr >
        <th>País</th>
        <th>Confirmados</th>
        <th>Mortos</th>
        <th class="no-show">Recuperados</th>
    </tr>
    `
;

async function getCorona() {
    const res = await fetch('https://www.trackcorona.live/api/countries');
    const data = await res.json();
    return data.data;
}

async function showCorona() {
    thead.style.display = 'none';
    const corona = await getCorona();
    let temp = "";
    let totalDead = 0;
    let totalConfirmed = 0;
    corona.forEach(element => {
            temp += `
                <tr class="country-name" data-country="${element.location}" style="display: none;">
                    <td><a href="https://www.trackcorona.live/country/${element.country_code}" target="_blank"><img src="https://www.countryflags.io/${element.country_code}/flat/64.png" alt="${element.location}"></a></td>            
                    <td class="align">${formatNum(element.confirmed)}</td>
                    <td class="align">${formatNum(element.dead)}</td>
                    <td class="align no-show">${formatNum(element.recovered)}</td>
                </tr>
            `;
        totalDead += element.dead;
        totalConfirmed += element.confirmed;
        
        document.getElementById("output").innerHTML = temp;
        document.getElementById("updated").innerHTML = `Atualizado em ${corona[0].updated.slice(0, 19)}`;
        document.getElementById("dead").innerHTML = `<b>Total de mortos:</b> ${formatNum(totalDead)}`;
        document.getElementById("confirmed").innerHTML = `<b>Total de contaminados:</b> ${formatNum(totalConfirmed)}`;
    });   
}

function filterCountry(e) { 
    const term = e.target.value.toUpperCase();
    const allCountries = document.querySelectorAll('.country-name');

    allCountries.forEach(country => {
        country.style.display = 'none';
        const countryName = country.getAttribute('data-country').toUpperCase();
        if (countryName.indexOf(term) > -1) {
            country.style.display = 'block';
            thead.style.display = 'block';   
        }
        if (term === '') {
            country.style.display = 'none';
            thead.style.display = 'none';
        }
    })
}

showCorona();

filter.addEventListener('input', filterCountry);

//format number
const formatNum = number => number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');