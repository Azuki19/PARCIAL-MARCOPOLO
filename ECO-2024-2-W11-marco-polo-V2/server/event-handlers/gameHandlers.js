// gameHandlers.js

const { assignRoles } = require('../utils/helpers');

// Assuming db and io are required or passed in some way to be accessible
const joinGameHandler = (socket, db, io) => {
	return (user) => {
		db.players.push({ id: socket.id, score: 0, ...user }); 
		io.emit('userJoined', db);
	};
};

const startGameHandler = (socket, db, io) => {
	return () => {
		db.players = assignRoles(db.players);

		db.players.forEach((element) => {
			io.to(element.id).emit('startGame', element.role);
		});
	};
};

const notifyMarcoHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'polo' || user.role === 'polo-especial');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Marco!!!',
				userId: socket.id,
			});
		});
	};
};

const notifyPoloHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'marco');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Polo!!',
				userId: socket.id,
			});
		});
	};
};

const onSelectPoloHandler = (socket, db, io) => {
	return (userID) => {
		const marco = db.players.find((user) => user.id === socket.id);
		const poloSelected = db.players.find((user) => user.id === userID);

		// Marco atrapa al Polo Especial
		if (poloSelected.role === 'polo-especial') {
			marco.score += 50;
			poloSelected.score -= 10;

			io.emit('notifyGameOver', {
				message: `¡El marco ${marco.nickname} atrapó al Polo especial ${poloSelected.nickname}!`,
			});
		} else {
			// Marco falla
			marco.score -= 10;

			io.emit('notifyGameOver', {
				message: `El marco ${marco.nickname} ha fallado y su puntuación es ${marco.score}`,
			});
		}

		// Comprobar si algún jugador ha alcanzado los 100 puntos
		const playerWith100Points = db.players.find((player) => player.score >= 100);

		if (playerWith100Points) {
			io.emit('notifyGameOver', {
				message: `¡El jugador ${playerWith100Points.nickname} ha ganado con ${playerWith100Points.score} puntos!`,
				winner: playerWith100Points.nickname,
			});

			io.emit('updateScores', db.players); // Actualizar puntajes
			io.emit('navigateToScreen2', db.players);
		} else {
			io.emit('updateScores', db.players); // Actualizar puntajes sin terminar el juego
		}
	};
};

module.exports = {
	joinGameHandler,
	startGameHandler,
	notifyMarcoHandler,
	notifyPoloHandler,
	onSelectPoloHandler,
};
