const Simon = {}
	
	
Simon.Game = (function() {
	const arr = ["red", "green", "blue", "yellow"]
	
	let sequence = []
	let playSequence = []
	
	return {
		init: () => {
		},
		
		getNextSequence: () => { 
			sequence.push(arr[Math.floor(Math.random() * 4)])
			playSequence = sequence.slice(0)
			
			return sequence.slice(0)
		},
		
		getFirstAndTrim: () => {
			return playSequence.shift()
		},
		
		getLength: () => playSequence.length,
		
		clear: () => {sequence = []}
	}
}())

Simon.Controller = (function() {
	const PLAYING = true
	const STOPPED = false
	
	let status = STOPPED
	
	function addListeners() {
		document.getElementById("red").addEventListener("click", onClick)
		document.getElementById("green").addEventListener("click", onClick)
		document.getElementById("blue").addEventListener("click", onClick)
		document.getElementById("yellow").addEventListener("click", onClick)
	}
	
	function removeListeners() {
		document.getElementById("red").removeEventListener("click", onClick)
		document.getElementById("green").removeEventListener("click", onClick)
		document.getElementById("blue").removeEventListener("click", onClick)
		document.getElementById("yellow").removeEventListener("click", onClick)
	}
	
	function onClick(e) {
		const nextNote = Simon.Game.getFirstAndTrim()
		
		if (e.target.id === nextNote) {
			Simon.View.play(e.target.id)
			
			if (Simon.Game.getLength() === 0) {
				removeListeners()

				setTimeout(function() {
					Simon.View.playSequence(Simon.Game.getNextSequence())
				}, 2000)
			}
		}
		else {
			const audio = document.getElementById("lose")
			audio.play()
			
			removeListeners()
			
			Simon.Controller.gameOver()
		}
	}
	
	return {
		init: (game, view) => {
			game.init()
			view.init()
		},
		
		clickStartButton: () => {
			status = !status
			
			if (status === PLAYING) {
				Simon.View.playSequence(Simon.Game.getNextSequence())
			}
		},
		
		donePlayingSequence: () => {
			addListeners()
		},
		
		gameOver: () => {
			status = STOPPED
			
			Simon.Game.clear()
		}
	}
}())

Simon.View = (function() {
	return {
		init: () => {
			document.getElementById("red").style.opacity 	= 0
			document.getElementById("green").style.opacity 	= 0
			document.getElementById("yellow").style.opacity = 0
			document.getElementById("blue").style.opacity 	= 0
			
			document.getElementById("btn").addEventListener("click", Simon.View.onClickStart)
		},
		
		onClickStart: (e) => {
			Simon.Controller.clickStartButton()
		},

		playSequence: (sequence) => {
			let timer
			
			document.querySelector("#simon p").innerText = Simon.Game.getLength()
			
			
			if (sequence.length > 0) {
				timer = setInterval(function() {
					Simon.View.play(sequence[0])
					
					sequence.splice(0, 1)
					
					if (sequence.length === 0) {
						clearInterval(timer)
						
						Simon.Controller.donePlayingSequence()
					}
				}.bind(this), 1000)
			}
			else {
				clearInterval(timer)
			}
		},
		
		play: (note) => {
			let selector = `audio[data-color=${note}]`
			const audio = document.querySelector(selector)
			audio.play()

			document.getElementById(note).style.opacity = 1

			setTimeout(function() {
				document.getElementById(note).style.opacity = 0
			}, 500)
		}
	}
}())


window.onload = function() {
	Simon.Controller.init(Simon.Game, Simon.View)
}