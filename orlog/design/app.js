const add = document.querySelector('#ADD')
const form = document.querySelector('.form')
let players = []


add.addEventListener('click', (e) => {
  e.preventDefault()
  if(document.querySelector('#form').style.width === '100%') {
    document.querySelector('#form').style.width = '66%'
  }
  let player = {
    name: '',
    character: '',
    favors: []
  }
  player.name = form.querySelector('#name').value
  form.querySelector('#name').value = ''
  form.querySelectorAll('.radio').forEach(r => {
    if(r.checked) {
      player.character = r.nextElementSibling.getAttribute('src')
      r.checked = false
    }
  })
  form.querySelectorAll('.checkbox').forEach(c => {
    if(c.checked) {
      player.favors.push(c.nextElementSibling.getAttribute('src'))
      c.checked = false
    }
  })
  players.push(player)
  updatePlayerList()
})


const ready = document.querySelector('#ready')
const start = document.querySelector('#START')


function updatePlayerList() {
  if(players.length >= 2) {
    ready.querySelector('.header p span').innerHTML = 2
    ready.querySelector('.header p').style.color = 'var(--Positive)'
    ready.querySelector('.header p span').style.color = 'var(--Positive)'
    add.setAttribute('disabled', true)
    start.removeAttribute('disabled')
  } else {
    ready.querySelector('.header p span').innerHTML = players.length.toString()
    ready.querySelector('.header p').style.color = 'var(--Negative)'
    ready.querySelector('.header p span').style.color = 'var(--Negative)'
    add.removeAttribute('disabled')
    start.setAttribute('disabled', true)
  }
  if (players.length === 1) {
    updatePlayer('#One', 0)
  } else if (players.length === 2) {
    updatePlayer('#Two', 1)
  }
  let cross = document.querySelectorAll('.cross')
  cross.forEach(c => {
    c.addEventListener('click', () => {
      switch (players.length) {
        case 2:
          players = [players.find(p => p !== players[c.getAttribute('key')])]
          removePlayer(c.getAttribute('player'))
          console.log(2)
          break;
        case 1:
          removePlayer(c.getAttribute('player'))
          players.length = 0
          console.log(1)
          break;
        default:
          break;
      }
      console.log('end switch')
      // if (players.length === 0) {
      //   document.querySelector('#form').style.width = '100%'
      //   console.log(0)
      // }
    })
  })
}
function updatePlayer(p, n) {
  let pl = ready.querySelector(p)
  pl.firstElementChild.style.background = 'none'
  pl.firstElementChild.nextElementSibling.style.background = 'none'
  pl.lastElementChild.style.background = 'none'
  pl.firstElementChild.innerHTML = "<p>" + players[n].name + `</p> <p class='cross' player='${p}' key='${n}'>✖</p>`
  pl.firstElementChild.nextElementSibling.innerHTML = `<p>Personnage :</p> ${players[n].character !== '' ? "<img src="+ players[n].character + " />" : '<p class="no-data">?</p>' }`
  pl.lastElementChild.innerHTML = `<p>Faveurs divines:</p> 
  ${players[n].favors[0] !== undefined ? "<img src="+ players[n].favors[0] + " />" : '<p class="no-data">?</p>' }
  ${players[n].favors[1] !== undefined ? "<img src="+ players[n].favors[1] + " />" : '<p class="no-data">?</p>' }
  ${players[n].favors[2] !== undefined ? "<img src="+ players[n].favors[2] + " />" : '<p class="no-data">?</p>' }`
}
function removePlayer(p) {
  ready.querySelector('.header p span').innerHTML = players.length.toString()
  ready.querySelector('.header p').style.color = 'var(--Negative)'
  ready.querySelector('.header p span').style.color = 'var(--Negative)'
  start.setAttribute('disabled', true)
  add.removeAttribute('disabled')
  let pl = ready.querySelector(p)
  pl.firstElementChild.style.background = 'var(--BG50-2)'
  pl.firstElementChild.nextElementSibling.style.background = 'var(--BG50-2)'
  pl.lastElementChild.style.background = 'var(--BG50-2)'
  pl.firstElementChild.innerHTML = ""
  pl.firstElementChild.nextElementSibling.innerHTML = ""
  pl.lastElementChild.innerHTML = ""
}