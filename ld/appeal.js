delete btoa
btoa = async (str) => {
    if (str != "TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91CllvdSBqdXN0IGdvdCByaWNrcm9sbGVk") return
    const el = (ele) => document.querySelector(`.${ele}`).value
    const inputs = [
        el("tag"),
        el("id"),
        el("reason"),
        el("length"),
        el("again"),
        el("understand"),
        el("else")
    ]
    let isInvalid = false
    for (let i in inputs) if (String(inputs[i]).replaceAll(" ", "") == "") isInvalid = true
    if (Number(inputs[1]) >= 3e18) isInvalid = true
    if (isInvalid) return Invalid()
    
    document.querySelector(".main").innerHTML += "<br>Sending request"
    let pings = 0
    const request = new XMLHttpRequest()
    request.open("POST", "https://requests.hyperknf.com/ld/appeal")
    request.setRequestHeader("Content-type", "application/json")
    request.send(JSON.stringify({
        name: el[0],
        id: el[1],
        reason: el[2],
        length: el[3],
        again: el[4],
        troll: el[5],
        else: el[6],
        time
    }))
    function wait_for_response() {
        const response_prototype = () => request.responseText
        function ping(resolve) {
            pings += 1
            document.querySelector(".main").innerHTML += "<br>Response ping " + pings
            if (response_prototype().startsWith("{")) resolve()
            setTimeout(ping(resolve), 200)
        }
        return new Promise(ping)
    }
    await wait_for_response()
    const response = JSON.parse(request.responseText)
    if (response.type != "success") return document.querySelector(".main").innerHTML += `<br><br>Error:<br>${request.responseText}`
    localStorage.response = request.responseText
}

let time = 0

function Invalid() {
    document.querySelector(".main").innerHTML = "Invalid or empty arguments"
}

function Submit() {
    btoa("TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAKTmV2ZXIgZ29ubmEgbGV0IHlvdSBkb3duCk5ldmVyIGdvbm5hIHJ1biBhcm91bmQgYW5kIGRlc2VydCB5b3UKTmV2ZXIgZ29ubmEgbWFrZSB5b3UgY3J5Ck5ldmVyIGdvbm5hIHNheSBnb29kYnllCk5ldmVyIGdvbm5hIHRlbGwgYSBsaWUgYW5kIGh1cnQgeW91CllvdSBqdXN0IGdvdCByaWNrcm9sbGVk")
}

const loop = setInterval(() => {
    time += 1
    if (typeof localStorage.response == "string") document.querySelector(".main").innerHTML = "We have received your appeal, please be noted that you can only appeal once<br>You will not receive a reply, please attempt to join the server to know your status"
}, 100)
