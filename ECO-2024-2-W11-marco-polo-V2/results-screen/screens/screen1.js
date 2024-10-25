import { router, socket } from '../routes.js';

export default function renderScreen1() {
	const app = document.getElementById('app');
	app.innerHTML = `
        <section id="results-screen">
        <h2>Resultados</h2>
        </section>

        <section id="players-scores">
        </section>
    `;

	const resultsScreen = document.getElementById('results-screen');
	const playersScores = document.getElementById('players-scores');

	socket.on('updateScores', (players) => {
		playersScores.innerHTML = ''; // Limpiar la tabla de puntuaciones

		players.forEach((player) => {
			const scoreRow = document.createElement('p');
			scoreRow.innerHTML = `${player.nickname}: ${player.score} puntos`;
			playersScores.appendChild(scoreRow);
		});

		resultsScreen.style.display = 'flex'; // Mostrar la pantalla de resultados
	});

	socket.on('notifyGameOver', (data) => {
		gameGround.style.display = 'none';
		gameOverText.innerHTML = data.message;

		if (data.winner) {
			// Mostrar la pantalla de resultados
			resultsScreen.style.display = 'flex';
		} else {
			gameOverScreen.style.display = 'flex';
		}
	});

	socket.on('updateScores', (players) => {
		playersScores.innerHTML = ''; // Limpiar la tabla de puntuaciones

		players
			.forEach((player, index) => {
				const scoreRow = document.createElement('p');
				scoreRow.innerHTML = `${player.nickname}: ${player.score} puntos`;
				playersScores.appendChild(scoreRow);
			});

		resultsScreen.style.display = 'flex'; // Mostrar la pantalla de resultados
	});

  socket.on('navigateToScreen2', (players) => {
    console.log('Redirigiendo a Screen 2 con jugadores:', players);
    router.navigateTo('/screen2', players);
  });

	socket.on('eventListenerExample', (data) => {});
}
