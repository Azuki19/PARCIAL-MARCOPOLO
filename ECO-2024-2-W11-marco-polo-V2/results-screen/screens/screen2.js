// Asegúrate de que esta línea esté al inicio
import { socket } from '../routes.js';

export default function renderScreen2(players) {
	const app = document.getElementById('app');
	app.innerHTML = `
        <h1>¡Tenemos un ganador!</h1>
        <section id="winner-info"></section>
        <section id="ranking-scores">
            <h2>Ranking de Jugadores</h2>
            <div id="players-list"></div>
            <button id="sort-alphabetically">Ordenar alfabéticamente</button>
        </section>
    `;

	const winnerInfo = document.getElementById('winner-info');
	const playersList = document.getElementById('players-list');
	const sortButton = document.getElementById('sort-alphabetically');

	// Función para mostrar la lista de jugadores
	function displayPlayers(players) {
		playersList.innerHTML = ''; // Limpiar la lista de jugadores

		// Verificar si hay jugadores válidos
		if (!players || players.length === 0) {
			playersList.innerHTML = '<p>No hay jugadores disponibles.</p>';
			return;
		}

		players.forEach((player) => {
			const playerRow = document.createElement('p');
			playerRow.innerHTML = `${player.nickname}: ${player.score} puntos`;
			playersList.appendChild(playerRow);
		});
	}

	// Función para manejar la actualización de puntajes y verificar el ganador
	function updateScores(updatedPlayers) {
		// Verificar que updatedPlayers es un arreglo válido
		if (!updatedPlayers || updatedPlayers.length === 0) {
			console.error('No se recibieron jugadores para actualizar.');
			return;
		}

		updatedPlayers.sort((a, b) => b.score - a.score); // Ordenar de mayor a menor
		displayPlayers(updatedPlayers);

		// Verificar si algún jugador tiene 100 puntos o más
		const winner = updatedPlayers.find((player) => player.score >= 100);

		if (winner) {
			winnerInfo.innerHTML = `Ganador: ${winner.nickname} con ${winner.score} puntos`;
		} else {
			winnerInfo.innerHTML = ''; // No mostrar ganador hasta que alguien alcance 100 puntos
		}
	}

	// Mostrar la lista inicialmente, solo si players es válido
	if (players && players.length > 0) {
		updateScores(players);
	} else {
		console.error('No se pasaron jugadores al renderizar Screen 2.');
	}

	// Añadir funcionalidad para ordenar alfabéticamente al presionar el botón
	sortButton.addEventListener('click', () => {
		if (players && players.length > 0) {
			const sortedPlayers = [...players].sort((a, b) => a.nickname.localeCompare(b.nickname));
			displayPlayers(sortedPlayers);
		} else {
			console.error('No se pueden ordenar los jugadores, no hay jugadores disponibles.');
		}
	});

	// Recibir las actualizaciones de puntajes desde el servidor
	socket.on('updateScores', (updatedPlayers) => {
		console.log('Actualización de puntajes recibida en Screen 2:', updatedPlayers);
		updateScores(updatedPlayers);
	});

	// Escuchar cuando se navegue a esta pantalla con los datos de jugadores
	socket.on('navigateToScreen2', (players) => {
		console.log('Redirigido a Screen 2 con jugadores:', players);
		updateScores(players);
	});
}
