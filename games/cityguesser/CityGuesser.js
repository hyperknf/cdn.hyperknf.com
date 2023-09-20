const prompt = require("prompt-sync")()

console.log("")
let username = prompt("Enter your GeoNames username: ")
while (username.replaceAll(" ") == "") {
    username = prompt("Enter your GeoNames username: ")
    if (username.replaceAll(" ") == "") console.log("Please give a valid username")
}
const geonames = require("geonames.js")({
    username,
    lan: "en",
    encoding: "JSON"
})
const distance = require("geo-distance")

function getLongLat(geoname) {
    return {
        lat: parseFloat(geoname.lat),
        lon: parseFloat(geoname.lng)
    }
}
function getDistanceKM(first, second) {
    return parseFloat(distance.between(first, second).human_readable().distance)
}
function randint(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function randletter() {
    return "abcdefghijklmnopqrstuvwxyz"[randint(0, 25)]
}
function formatName(geoname) {
    const regions = []
    let count = 1
    while (geoname[`adminName${count}`]) {
        regions.push(geoname[`adminName${count}`])
        count++
    }
    regions.push("")
    return `${geoname.name}, ${regions.join(", ")}${geoname.countryName}`
}

async function main() {
    let minimum_population
    while (typeof minimum_population != "number" || isNaN(minimum_population) || minimum_population < 0 || minimum_population > 3e7) {
        minimum_population = parseInt(prompt("Enter minimum population (larger number = longer search time): "))
        if (typeof minimum_population != "number" || isNaN(minimum_population) || minimum_population < 0 || minimum_population > 3e7) console.log("That was not a valid number between 0 and 30,000,000")
    }
    const show_city = prompt("Show answer? (\"y\" = yes, anything else = no): ").toLowerCase() == "y" ? true : false
    const show_country_identitication = prompt("Show if your guess is in same country/region as answer? (\"y\" = yes, anything else = no): ").toLowerCase() == "y" ? true : false

    console.log("Choosing city...")
    let chosen_cities = {}
    let chosen_city
    while (!chosen_cities.geonames || !chosen_cities.geonames[0]) {
        chosen_cities = await geonames.search({
            featureClass: "P",
            continentCode: ["AF", "AN", "AS", "EU", "NA", "OC", "SA"][randint(0, 6)],
            orderby: "random",
            type: "city",
            maxRows: 1000,
            q: randletter() + randletter()
        })
        if (!chosen_cities.geonames) continue
        if (!chosen_cities.geonames[0]) continue
        chosen_city = chosen_cities.geonames[randint(0, chosen_cities.geonames.length - 1)]
        if (chosen_city.population < minimum_population) chosen_cities = {}
    }
    console.log(`Finished choosing city${show_city ? `, the city is ${formatName(chosen_city)}` : ""}`)

    console.log("Type \".giveup\" to give up")
    console.log("Type \".hint\" for hints")

    let guessed = false
    let guesses = 0
    while (!guessed) {
        const guess = prompt("Enter your guess: ")
        if (guess.replaceAll(" ") == "") {
            console.log("Please give a valid guess")
            continue
        }
        if (guess == ".giveup") {
            console.log("You have gave up")
            console.log(`The answer is ${formatName(chosen_city)}`)
            break
        }
        if (guess.startsWith(".hint")) {
            const args = guess.split(" ")
            if (args.length < 2) {
                console.log("Please specify hint type (\"country\" or \"continent\")")
                continue
            } else {
                if (args[1] == "country") {
                    if (guesses < 50) {
                        console.log(`You need at least 50 guesses to get this hint, and you have only guessed ${guesses} times`)
                        continue
                    }
                    console.log(`Hint: The country is ${chosen_city.countryName}`)
                } else if (args[1] == "continent") {
                    if (guesses < 30) {
                        console.log(`You need at least 30 guesses to get this hint, and you have only guessed ${guesses} times`)
                        continue
                    }
                    const country_info = await geonames.countryInfo({
                        country: chosen_city.countryCode
                    })
                    console.log(`Hint: The continent is ${country_info.geonames[0].continentName}`)
                } else {
                    console.log("That was not a valid hint type")
                }
                continue
            }
        }
        const input_city = await geonames.search({
            featureClass: "P",
            q: guess,
            type: "city"
        })
        if (input_city.geonames.length < 1) {
            console.log("That was not a valid city")
            continue
        } else {
            guesses++
            const city_guess = input_city.geonames[0]
            if (!(city_guess.population >= minimum_population)) {
                console.log("That was not a city with enough population")
                continue
            }
            if (city_guess.geonameId == chosen_city.geonameId) {
                guessed = true
                console.log("Congratulations, that was correct!")
            } else {
                console.log(`Your answer is ${formatName(city_guess)}`)
                console.log(`Your answer is wrong, and is ${getDistanceKM(getLongLat(chosen_city), getLongLat(city_guess))}km away from the correct answer${show_country_identitication ? `, and is in the ${chosen_city.countryId == city_guess.countryId ? "same" : "different"} country/region as the answer` : ""}`)
            }
            continue
        }
    }
}

let playing = true
async function iteration() {
    try {
        console.log("")
        await main()
    } catch (exception) {
        throw new Error(`This can be caused by an invalid GeoNames username, or your computer does not have internet connection\nDetected error:\n - ${exception}`)
    }
    if (prompt("Play again? (\"y\" = yes, anything else = no): ") == "y") {
        console.log("Starting new round...")
    } else playing = false
    if (playing) await iteration()
}

iteration().then(() => {
    prompt("Type anything to exit: ")
})