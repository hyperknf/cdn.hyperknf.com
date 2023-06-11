delete _count
delete _loops
delete _elements
delete _stop
delete _wait
delete _config

let _count = 0

const _config = {
    _cooldown: 700
}

function _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
const _elements = document.getElementsByClassName("iiJ4W")
const _loops = []
for (let i = 0; i <= _elements.length - 1; i++) {
    await _wait(_config._cooldown / _elements.length)
    const _loop = setInterval(() => {
        _elements[i].click()
        console.log(++_count)
    }, _config._cooldown)
    _loops.push(_loop)
}

function _stop() {
    _loops.forEach(_loop => clearInterval(_loop))
}
