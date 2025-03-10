document.addEventListener("contentLoader", () => {
    const input = document.getElementById("country-input");
    const button = document.getElementById("submit-button");
    const countryDetails = document.getElementById("country-details");
    const countryFlag = document.getElementById("country-flag");
    const borderingCountriesSection = document.getElementById("bordering-countries");
    
    button.addEventListener("click", () => {
        const countryName = input.value.trim();
        if (countryName) {
            fetchCountryData(countryName);
        }
    });
    
    async function fetchCountryData(country) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);
            if (!response.ok) {
                throw new Error("Country not found. Please try again");
            }
            
            const data = await response.json();
            const countryData = data[0];
            
            const capital = countryData.capital ? countryData.capital[0] : "No capital available";
            const population = countryData.population.toLocaleString();
            const region = countryData.region;
            const flagUrl = countryData.flags.svg;
            const borders = countryData.borders || [];
            
            countryDetails.innerHTML = `
                <strong>Capital:</strong> ${capital}<br>
                <strong>Population:</strong> ${population}<br>
                <strong>Region:</strong> ${region}<br>
            `;
            countryFlag.src = flagUrl;
            countryFlag.style.display = "block";
            
            borderingCountriesSection.innerHTML = "<h2>Bordering Countries</h2>";
            if (borders.length > 0) {
                const borderRequests = borders.map(code => fetch(`https://restcountries.com/v3.1/alpha/${code}`));
                const borderResponses = await Promise.all(borderRequests);
                const borderData = await Promise.all(borderResponses.map(res => res.json()));
                
                borderData.forEach(countryArray => {
                    const borderCountry = countryArray[0];
                    const borderName = borderCountry.name.common;
                    const borderFlag = borderCountry.flags.svg;
                    
                    const countrySection = document.createElement("section");
                    countrySection.innerHTML = `
                        <p><strong>${borderName}</strong></p>
                        <img src="${borderFlag}" alt="Flag of ${borderName}" width="50">
                    `;
                    borderingCountriesSection.appendChild(countrySection);
                });
            } else {
                borderingCountriesSection.innerHTML += "<p>No bordering countries.</p>";
            }
        } catch (error) {
            countryDetails.innerHTML = `<p style="color: red;">${error.message}</p>`;
            countryFlag.style.display = "none";
            borderingCountriesSection.innerHTML = "";
        }
    }
});
