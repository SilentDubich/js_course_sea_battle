const mainContainerEl = document.querySelector('.content');

const model = {};

const view = {};

const control = {
	history: [],
	difficulty: null,
	probabilities: {
		'easy' : 0,
		'normal' : 0.25,
		'hard' : 0.5,
		'very hard' : 0.75
	},
	size: null,
	totalShoots: 0,
	totalShipSunks: 0,
	isWithBot: null,
	isStarted: false,
	isPlayerShooting: true,
	randomGenerateShip: (forWhat, ship) => {
		const size = control.size;
		const shipSize = ship.size;
		const character = model[forWhat];

		if (character.failCounter === 10) {
			character.failCounter = 0;
			returnOnPlaceAllShips();
			delete character.borders;
			character.ships.forEach(ship => ship.location = []);
			character.ships.forEach(ship => delete ship.reservedCoords);
			return character.ships.forEach(ship => control.randomGenerateShip(forWhat, ship));
		}

		ship.location = [];
		let borders = [];
		if (!ship.reservedCoords) ship.reservedCoords = [];
		if (!character.borders) character.borders = [];


		const row = Math.floor(Math.random() * size);
		const col = Math.floor(Math.random() * size);
		const generateDirections = [];

		const canGenerateUp = row - shipSize >= 0;
		const canGenerateRight = col + shipSize < size;
		const canGenerateDown = row + shipSize < size;
		const canGenerateLeft = col - shipSize >= 0;

		if (canGenerateUp) generateDirections.push('up');
		if (canGenerateRight) generateDirections.push('right');
		if (canGenerateDown) generateDirections.push('down');
		if (canGenerateLeft) generateDirections.push('left');

		const directionsCount = generateDirections.length;
		if (!directionsCount) return control.randomGenerateShip(forWhat, ship);
		const directionNumber = Math.floor(Math.random() * directionsCount);
		const direction = generateDirections[directionNumber];

		let upBorder, downBorder, leftBorder, rightBorder, upLeftBorder, upRightBorder, downLeftBorder, downRightBorder;
		switch (direction) {
			case 'up':
				upBorder = (row - shipSize).toString() + col.toString();
				upLeftBorder = (row - shipSize).toString() + (col - 1).toString();
				upRightBorder = (row - shipSize).toString() + (col + 1).toString();

				downBorder = (row + 1).toString() + col.toString();
				downLeftBorder = (row + 1).toString() + (col - 1).toString();
				downRightBorder = (row + 1).toString() + (col + 1).toString();

				for (let i = 0; i < shipSize; i++) {
					const coordination = (row - i).toString() + col.toString();

					if (character.borders.indexOf(coordination) !== -1) {
						model[forWhat].failCounter++;
						delete ship.reservedCoords;
						return control.randomGenerateShip(forWhat, ship);
					}

					leftBorder = (row - i).toString() + (col - 1).toString();
					rightBorder = (row - i).toString() + (col + 1).toString();
					borders.push(leftBorder, rightBorder, coordination);
					ship.location.unshift(coordination);
					ship.reservedCoords.push(leftBorder, rightBorder);
				}

				borders.push(upBorder, upLeftBorder, upRightBorder, downBorder, downLeftBorder, downRightBorder);
				ship.reservedCoords.push(upBorder, upLeftBorder, upRightBorder, downBorder, downLeftBorder, downRightBorder);
				break;
			case 'right':
				leftBorder = row.toString() + (col - 1).toString();
				upLeftBorder = (row + 1).toString() + (col - 1).toString();
				downLeftBorder = (row - 1).toString() + (col - 1).toString();

				rightBorder = row.toString() + (col + shipSize).toString();
				upRightBorder = (row + 1).toString() + (col + shipSize).toString();
				downRightBorder = (row - 1).toString() + (col + shipSize).toString();

				for (let i = 0; i < shipSize; i++) {
					const coordination = row.toString() + (col + i).toString();

					if (character.borders.indexOf(coordination) !== -1) {
						model[forWhat].failCounter++;
						delete ship.reservedCoords;
						return control.randomGenerateShip(forWhat, ship);
					}

					upBorder = (row + 1).toString() + (col + i).toString();
					downBorder = (row - 1).toString() + (col + i).toString();
					borders.push(upBorder, downBorder, coordination);
					ship.location.push(coordination);
					ship.reservedCoords.push(upBorder, downBorder);
				}

				borders.push(leftBorder, upLeftBorder, downLeftBorder, rightBorder, upRightBorder, downRightBorder);
				ship.reservedCoords.push(leftBorder, upLeftBorder, downLeftBorder, rightBorder, upRightBorder, downRightBorder);
				break;
			case 'down':
				upBorder = (row - 1).toString() + col.toString();
				upLeftBorder = (row - 1).toString() + (col - 1).toString();
				upRightBorder = (row - 1).toString() + (col + 1).toString();

				downBorder = (row + shipSize).toString() + col.toString();
				downLeftBorder = (row + shipSize).toString() + (col - 1).toString();
				downRightBorder = (row + shipSize).toString() + (col + 1).toString();

				for (let i = 0; i < shipSize; i++) {
					const coordination = (row + i).toString() + col.toString();

					if (character.borders.indexOf(coordination) !== -1) {
						model[forWhat].failCounter++;
						delete ship.reservedCoords;
						return control.randomGenerateShip(forWhat, ship);
					}

					leftBorder = (row + i).toString() + (col - 1).toString();
					rightBorder = (row + i).toString() + (col + 1).toString();
					borders.push(leftBorder, rightBorder, coordination);
					ship.location.push(coordination);
					ship.reservedCoords.push(leftBorder, rightBorder);
				}

				borders.push(upBorder, upLeftBorder, upRightBorder, downBorder, downLeftBorder, downRightBorder);
				ship.reservedCoords.push(upBorder, upLeftBorder, upRightBorder, downBorder, downLeftBorder, downRightBorder);
				break;
			case 'left':
				leftBorder = row.toString() + (col - shipSize).toString();
				upLeftBorder = (row + 1).toString() + (col - shipSize).toString();
				downLeftBorder = (row - 1).toString() + (col - shipSize).toString();

				rightBorder = row.toString() + (col + 1).toString();
				upRightBorder = (row + 1).toString() + (col + 1).toString();
				downRightBorder = (row - 1).toString() + (col + 1).toString();

				for (let i = 0; i < shipSize; i++) {
					const coordination = row.toString() + (col - i).toString();

					if (character.borders.indexOf(coordination) !== -1) {
						model[forWhat].failCounter++;
						delete ship.reservedCoords;
						return control.randomGenerateShip(forWhat, ship);
					}

					upBorder = (row + 1).toString() + (col - i).toString();
					downBorder = (row - 1).toString() + (col - i).toString();
					borders.push(upBorder, downBorder, coordination);
					ship.location.unshift(coordination);
					ship.reservedCoords.push(upBorder, downBorder);
				}

				borders.push(leftBorder, upLeftBorder, downLeftBorder, rightBorder, upRightBorder, downRightBorder);
				ship.reservedCoords.push(leftBorder, upLeftBorder, downLeftBorder, rightBorder, upRightBorder, downRightBorder);
				break;
		}
		const fields = [ ...mainContainerEl.querySelectorAll('.field') ];
		const fieldIds = fields.map(field => field.fieldId);
		const normalizedBorders = [];
		const normalizedReservedCoords = [];
		ship.reservedCoords.forEach(border => {
			const coord = fieldIds.find(fieldId => fieldId === border);
			if (coord) normalizedReservedCoords.push(border);
		});

		borders.forEach(border => {
			const coord = fieldIds.find(fieldId => fieldId === border);
			if (coord) normalizedBorders.push(border);
		});
		ship.reservedCoords = normalizedReservedCoords;
		character.borders.push(...normalizedBorders);
		character.failCounter = 0;
	},
	createShips: forWhat => {
		const size = control.size;
		model[forWhat].ships = [
			{ location: [], size: 3, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false }
		];
		if (size === 10) {
			model[forWhat].ships.unshift({ location: [], size: 3, hits: 0, isSunk: false });
			model[forWhat].ships.unshift({ location: [], size: 4, hits: 0, isSunk: false });
		}
	},
	isShipSunk: (ship, who) => {
		const battleField = mainContainerEl.querySelector(who);
		const fields = [ ...battleField.querySelectorAll('.field') ];
		if (ship.hits === ship.size) {
			ship.reservedCoords.forEach(resCoord => {
				const field = fields.find(botField => botField.fieldId === resCoord);
				if (field) field.classList.add('bomb');
			})
			ship.isSunk = true;
			return true;
		}
		return false;
	}
};


const firePlayer = coord => {
	if (!control.isPlayerShooting) return;
	control.totalShoots++;
	if (control.totalShoots === 1) control.isStarted = true;

	const bot = model.bot;
	const botShips = bot.ships;
	const botField = mainContainerEl.querySelector('.bot');
	const botFields = [ ...botField.querySelectorAll('.field') ];

	const targetField = botFields.find(field => field.fieldId === coord);
	const enemyShip = botShips.find(ship => ship.location.indexOf(coord) !== -1);
	const isWasHits = targetField.classList.contains('miss') || targetField.classList.contains('hit') || targetField.classList.contains('bomb');
	if (isWasHits) return;

	if (!enemyShip) {
		control.isPlayerShooting = false;
		if (!isWasHits) targetField.classList.add('miss');

		return setTimeout(model.bot.fireBot, 500);
	}

	enemyShip.hits++;
	targetField.classList.add('hit');
	control.isShipSunk(enemyShip, '.bot');
}


const fireBot = () => {
	if (model.bot.firstHit) {
		const { shootCoord, ship } = model.bot.firstHit;
		return setTimeout(fireBotSecondShoot, 500, shootCoord, ship);
	}
	control.totalShoots++;
	const probabilities = control.probabilities;
	const difficulty = control.difficulty;
	const probability = probabilities[difficulty];
	const player = model.player;
	const playerShips = player.ships;
	const playerField = mainContainerEl.querySelector('.player');
	const playerFields = [ ...playerField.querySelectorAll('.field') ];

	const availableFieldsToShoot = playerFields.filter(field => !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));
	const availableFieldsToShootLength = availableFieldsToShoot.length;
	const playerShipsToShoot = model.player.ships.map(ship => ship.location);
	let playerShipsToShootCoords = [];
	playerShipsToShoot.forEach(ship => playerShipsToShootCoords = [ ...playerShipsToShootCoords, ...ship ]);
	const availableToShootsCoordsPlayerShips = availableFieldsToShoot.filter(field => playerShipsToShootCoords.indexOf(field.fieldId) !== -1);
	const availableToShootsCoordsPlayerShipsLength = availableToShootsCoordsPlayerShips.length;

	let isShootToPlayer = false;
	const random = Math.random();
	if (random < probability) isShootToPlayer = true;

	const shoot = isShootToPlayer ? Math.floor(Math.random() * availableToShootsCoordsPlayerShipsLength) : Math.floor(Math.random() * availableFieldsToShootLength);
	const targetField = isShootToPlayer ? availableToShootsCoordsPlayerShips[shoot] : availableFieldsToShoot[shoot];

	const targetShip = playerShips.find(ship => ship.location.indexOf(targetField.fieldId) !== -1);
	if (!targetShip) {
		control.isPlayerShooting = true;
		if (model.bot.firstHit) delete model.bot.firstHit;
		if (model.bot.secondHit) delete model.bot.secondHit;
		return targetField.classList.add('miss');
	}

	targetShip.hits++;
	targetField.classList.add('hit');
	const isShipSunk = control.isShipSunk(targetShip, '.player');
	if (isShipSunk) {
		return setTimeout(model.bot.fireBot, 500);
	} else {
		model.bot.firstHit = {};
		model.bot.firstHit.shootCoord = targetField.fieldId;
		model.bot.firstHit.ship = targetShip;
		return setTimeout(fireBotSecondShoot, 500, targetField.fieldId, targetShip);
	}
}


const fireBotSecondShoot = (oldShootCoord, ship) => {
	const playerBattleField = mainContainerEl.querySelector('.player');
	let playerField = [ ...playerBattleField.querySelectorAll('.field') ];

	const rowAndCol = oldShootCoord.toString().split('');
	const [ row, col ] = rowAndCol;

	const leftCoord = `${ row }${ +col - 1 }`;
	const rightCoord = `${ row }${ +col + 1 }`;
	const downCoord = `${ +row - 1 }${ col }`;
	const upCoord = `${ +row + 1 }${ col }`;
	let coordToShoot, isHit, targetField;

	if (!model.bot.secondHit) {
		let coords = [ leftCoord, upCoord, rightCoord, downCoord ];
		const availableCoords = playerField.filter(field => coords.indexOf(field.fieldId) !== -1 && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));
		coords = availableCoords.map(field => field.fieldId);
		const coordsLength = availableCoords.length;
		const indexToShoot = Math.floor(Math.random() * coordsLength);
		coordToShoot = coords[indexToShoot];

		isHit = ship.location.indexOf(coordToShoot) !== -1;
		control.totalShoots++;
		targetField = playerField.find(field => field.fieldId === coordToShoot);
		if (!isHit) {
			control.isPlayerShooting = true;
			if (targetField) targetField.classList.add('miss');
			return;
		}
		targetField.classList.add('hit');
		ship.hits++;
		let isSunkShip = control.isShipSunk(ship, '.player');
		if (isSunkShip) {
			delete model.bot.firstHit;
			if (model.bot.secondHit) delete model.bot.secondHit;
			return setTimeout(model.bot.fireBot, 500);
		}
	} else {
		const direction = model.bot.firstHit.direction;
		isHit = true;
		switch (direction) {
			case "up":
				coordToShoot = downCoord;
				break;
			case "right":
				coordToShoot = leftCoord;
				break;
			case "down":
				coordToShoot = upCoord;
				break;
			case "left":
				coordToShoot = rightCoord;
				break;
		}
		targetField = playerField.find(field => field.fieldId === coordToShoot);
	}


	let count = 2;
	while (isHit) {
		playerField = [ ...playerBattleField.querySelectorAll('.field') ];
		const rowAndCol = targetField.fieldId.split('');
		let [ row, col ] = rowAndCol;
		row = +row;
		col = +col;
		const isUp = coordToShoot - oldShootCoord <= -10;
		const isRight = coordToShoot - oldShootCoord >= 1 && coordToShoot - oldShootCoord < 10;
		const isDown = coordToShoot - oldShootCoord >= 10;
		const isLeft = coordToShoot - oldShootCoord <= -1 && coordToShoot - oldShootCoord > -10;
		if (isUp) {
			model.bot.firstHit.direction = 'up';
			coordToShoot = `${ row - 1 }${ col }`;

			targetField = playerField.find(field => field.fieldId === coordToShoot && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));

			if (!targetField) {
				coordToShoot = `${ row + count }${ col }`;
				targetField = playerField.find(field => field.fieldId === coordToShoot && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));
			}
			else {
				isHit = repeatedShoot(ship, targetField, playerField, coordToShoot);
			}

		} else if (isRight) {
			model.bot.firstHit.direction = 'right';
			coordToShoot = `${ row }${ col + 1 }`;

			targetField = playerField.find(field => field.fieldId === coordToShoot && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));

			if (!targetField) {
				coordToShoot = `${ row }${ col - count }`;
				targetField = playerField.find(field => field.fieldId === coordToShoot && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));
			}
			else {
				isHit = repeatedShoot(ship, targetField, playerField, coordToShoot);
			}

		} else if (isDown) {
			model.bot.firstHit.direction = 'down';
			coordToShoot = `${ row + 1 }${ col }`;

			targetField = playerField.find(field => field.fieldId === coordToShoot && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));

			if (!targetField) {
				coordToShoot = `${row - count}${col}`;
				targetField = playerField.find(field => field.fieldId === coordToShoot && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));
			}
			else {
				isHit = repeatedShoot(ship, targetField, playerField, coordToShoot);
			}

		} else if (isLeft) {
			model.bot.firstHit.direction = 'left';
			coordToShoot = `${ row }${ col - 1 }`;

			targetField = playerField.find(field => field.fieldId === coordToShoot && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));

			if (!targetField) {
				coordToShoot = `${ row }${ col + count }`;
				targetField = playerField.find(field => field.fieldId === coordToShoot && !field.classList.contains('miss') && !field.classList.contains('hit') && !field.classList.contains('bomb'));
			}
			else {
				isHit = repeatedShoot(ship, targetField, playerField, coordToShoot);
			}
		}
		count++;
	}
}


const repeatedShoot = (ship, targetField, playerField, coordToShoot) => {
	const isHit = ship.location.indexOf(coordToShoot) !== -1;
	control.totalShoots++;
	if (!isHit) {
		control.isPlayerShooting = true;
		targetField.classList.add('miss');
		return isHit;
	}
	targetField.classList.add('hit');
	ship.hits++;
	const isSunkShip = control.isShipSunk(ship, '.player');
	model.bot.secondHit = true;
	if (isSunkShip) {
		delete model.bot.firstHit;
		if (model.bot.secondHit) delete model.bot.secondHit;
		setTimeout(model.bot.fireBot, 500);
		return isHit;
	}
	else {
		return isHit;
	}
}


const setShipStyles = forWhat => {
	const shipContainerEls = getShipContainerEls();
	const { fieldCoords } = getFieldCoords();

	const character = model[forWhat];
	const charactersShips = character.ships;
	window.shipsStartPoints = {};
	charactersShips.forEach(charactersShip => {
		const { shipId, location } = charactersShip;
		const shipContainerEl = shipContainerEls.find(shipContainerEl => +shipContainerEl.id === shipId);
		let isUpGenerate = false;
		if (location.length > 1) {
			const firstCoord = location[0];
			const secondCoord = location[1];
			const diff = Math.abs(firstCoord - secondCoord);
			if (diff === 10) isUpGenerate = true;
		}
		if (shipContainerEl) {
			if (isUpGenerate) shipContainerEl.classList.add('rotate');
			else shipContainerEl.classList.remove('rotate');
			const { startAbscissa, startOrdinate } = getShipContainerElCoords(shipContainerEl);
			window.shipsStartPoints[shipContainerEl.id] = { startX: startAbscissa, startY: startOrdinate };
			const firstLocation = location[0];
			const { fieldStartX, fieldStartY } = fieldCoords[firstLocation];
			const diffStartX = fieldStartX - startAbscissa;
			const diffStartY = fieldStartY - startOrdinate;
			shipContainerEl.style.transform = `translate(${ diffStartX }px, ${ diffStartY }px)`;
		}
	})
}

const renderGameModeButtons = () => {
	const gameModeEl = document.createElement('div');
	gameModeEl.classList.add('game_mode');
	const chooseGameModeEl = document.createElement('div');
	chooseGameModeEl.classList.add('choose_game_model');
	chooseGameModeEl.innerText = 'Выберите режим игры:';
	const buttonsContainerEl = document.createElement('div');
	buttonsContainerEl.classList.add('game_mode_buttons');
	const pveButtonEl = document.createElement('div');
	pveButtonEl.innerText = 'Игра с ботом';
	pveButtonEl.classList.add('pve_button', 'button');
	pveButtonEl.addEventListener('click', e => {
		setGameMode(true);
		gameModeEl.remove();
	});
	const pvpButtonEl = document.createElement('div');
	pvpButtonEl.classList.add('pvp_button', 'button');
	pvpButtonEl.innerText = 'Онлайн режим';
	pvpButtonEl.addEventListener('click', e => {
		setGameMode(false);
		gameModeEl.remove();
	});
	buttonsContainerEl.append(...[ pveButtonEl, pvpButtonEl ]);
	gameModeEl.append(...[ chooseGameModeEl, buttonsContainerEl ]);
	mainContainerEl.append(gameModeEl);
}


const createBattleField = size => {
	const letters = {
		'0': 'A',
		'1': 'B',
		'2': 'C',
		'3': 'D',
		'4': 'E',
		'5': 'F',
		'6': 'G',
		'7': 'H',
		'8': 'I',
		'9': 'J',
		'10': 'K'
	}
	const battleFieldEl = document.createElement('div');
	battleFieldEl.classList.add('battle_field');
	const rowsEl = document.createElement('div');
	rowsEl.classList.add('rows');
	battleFieldEl.append(rowsEl);

	for (let i = 0; i < size; i++) {
		const letter = letters[i];
		const letterEl = document.createElement('div');
		letterEl.classList.add('letter');
		letterEl.innerText = letter;
		const rowEl = document.createElement('div');
		rowEl.classList.add('row');
		rowsEl.append(rowEl);
		rowEl.append(letterEl);

		for (let j = 0; j < size; j++) {
			const fieldEl = document.createElement('div');
			fieldEl.classList.add('field');
			const fieldId = i.toString() + j.toString();
			fieldEl.fieldId = fieldId;
			rowEl.append(fieldEl);
		}
	}
	const numbersEl = document.createElement('div');
	numbersEl.classList.add('numbers');
	battleFieldEl.append(numbersEl);

	for (let k = 0; k <= size; k++) {
		const numberEl = document.createElement('div');
		numberEl.classList.add('number');
		numbersEl.append(numberEl);
		if (k) numberEl.innerText = k.toString();
	}
	return battleFieldEl;
}


const renderChooseFieldSize = () => {
	const chooseFieldContainer = document.createElement('div');
	chooseFieldContainer.classList.add('choose_field');
	const fieldText = document.createElement('div');
	fieldText.classList.add('field_text');
	fieldText.innerText = 'Выберите размер поля:';
	const fieldSizeButtonsContainer = document.createElement('div');
	fieldSizeButtonsContainer.classList.add('field_size_buttons');
	const fieldSizeButtonSeven = document.createElement('div');
	fieldSizeButtonSeven.classList.add('field_size_button', 'button');
	fieldSizeButtonSeven.innerText = '8 X 8';
	fieldSizeButtonSeven.addEventListener('click', e => {
		setFieldSize(8);
		chooseFieldContainer.remove();
	});
	const fieldSizeButtonTen = document.createElement('div');
	fieldSizeButtonTen.classList.add('field_size_button', 'button');
	fieldSizeButtonTen.innerText = '10 X 10';
	fieldSizeButtonTen.addEventListener('click', e => {
		setFieldSize(10);
		chooseFieldContainer.remove();
	});
	fieldSizeButtonsContainer.append(...[ fieldSizeButtonSeven, fieldSizeButtonTen ]);
	chooseFieldContainer.append(...[ fieldText, fieldSizeButtonsContainer ]);
	mainContainerEl.append(chooseFieldContainer);
}


const renderOptionButtons = () => {
	const optionButtonsContainer = document.createElement('div');
	optionButtonsContainer.classList.add('options');
	const startGameButton = document.createElement('div');
	startGameButton.classList.add('start_game_button', 'button', 'disabled');
	startGameButton.innerText = 'Начать игру';
	const randomGenerateShipsButton = document.createElement('div');
	randomGenerateShipsButton.classList.add('random_generate_button', 'button');
	randomGenerateShipsButton.innerText = 'Сгенерировать случайно';
	randomGenerateShipsButton.addEventListener('click', e => {
		returnOnPlaceAllShips();
		model.player.failCounter = 0;
		model.player.ships.forEach(ship => ship.location = []);
		model.player.ships.forEach(ship => ship.reservedCoords && delete ship.reservedCoords);
		model.player.ships.forEach(ship => control.randomGenerateShip("player", ship));
		delete model.player.failCounter;
		delete model.player.borders;
		setOccupiedField();
		setShipStyles('player');
		startGameButton.classList.remove('disabled');
	});
	startGameButton.addEventListener('click', e => {
		if (startGameButton.classList.contains('disabled')) return;
		while (mainContainerEl.firstChild) mainContainerEl.firstChild.remove();
		startGame();
	});
	optionButtonsContainer.append(...[ startGameButton, randomGenerateShipsButton ]);
	mainContainerEl.append(optionButtonsContainer);
}


const renderChooseDifficulty = () => {
	const difficulties = [ 'Легкий', 'Средний', 'Сложный', 'Очень сложный' ];
	const difficultiesEng = [ 'easy', 'normal', 'hard', 'very hard' ];
	const chooseDifficulty = document.createElement('div');
	chooseDifficulty.classList.add('choose_difficulty');
	const difficultyTextEl = document.createElement('div');
	difficultyTextEl.classList.add('difficulty_text');
	difficultyTextEl.innerText = 'Выберите уровень сложности:';
	const difficultyContainer = document.createElement('div');
	difficultyContainer.classList.add('difficulty_container');
	difficulties.forEach((difficulty, i) => {
		const difficultyEl = document.createElement('div');
		difficultyEl.classList.add('button', 'difficulty');
		difficultyEl.innerText = difficulty;
		difficultyEl.addEventListener('click', e => {
			setDifficulty(difficultiesEng[i]);
			chooseDifficulty.remove();
		});
		difficultyContainer.append(difficultyEl);
	});
	chooseDifficulty.append(...[ difficultyTextEl, difficultyContainer ]);
	mainContainerEl.append(chooseDifficulty);
}

const renderShipsToDragDrop = () => {
	const dragDropContainerEl = document.createElement('div');
	dragDropContainerEl.classList.add('drag_drop');
	const player = model.player;
	window.shipsStartPoints = {};
	window.startPointAbscissa = [];
	window.startPointOrdinate = [];
	window.shipsOnBattleField = {};
	const shipPartWidth = 50;
	const marginBetween = 30;
	let currentOffset = 0;
	player.ships.forEach((ship, i) => {
		const shipSize = ship.size;
		const shipContainerEl = document.createElement('div');
		shipContainerEl.id = i;
		ship.shipId = i;
		shipContainerEl.classList.add('drag_drop_ship_container');
		shipContainerEl.style.left = `${ currentOffset }px`;
		shipContainerEl.individualOffset = currentOffset;
		currentOffset += shipPartWidth * shipSize + marginBetween;
		for (let i = 0; i < shipSize; i++) {
			const shipEl = document.createElement('div');
			shipEl.classList.add('drag_drop_ship');
			shipContainerEl.append(shipEl);
		}
		shipContainerEl.addEventListener('mousedown', e => {
			const isShipPlaced = window.shipsOnBattleField[shipContainerEl.id];
			if (isShipPlaced) delete window.shipsOnBattleField[shipContainerEl.id];
			const { battleField, fieldCoords } = getFieldCoords();
			const { bfStartX, bfStartY, bfEndX, bfEndY } = battleField;
			const clickPlaceX = e.clientX;
			const clickPlaceY = e.clientY;
			const shipCoords = shipContainerEl.getBoundingClientRect();
			const startAbscissa = shipCoords.x;
			const startOrdinate = shipCoords.y;
			const shiftX = clickPlaceX - startAbscissa;
			const shiftY = clickPlaceY - startOrdinate;
			if (!window.shipsStartPoints[i]) window.shipsStartPoints[i] = { startX: startAbscissa, startY: startOrdinate };
			const startX = window.shipsStartPoints[i].startX;
			const startY = window.shipsStartPoints[i].startY;
			const moveShip = e => {
				const currentCursorPlaceX = e.pageX;
				const currentCursorPlaceY = e.pageY;
				const diffX = currentCursorPlaceX - startX - shiftX;
				const diffY = currentCursorPlaceY - startY - shiftY;
				shipContainerEl.style.transform = `translate(${ diffX }px, ${ diffY }px)`;
				const { startAbscissa, startOrdinate, endAbscissa, endOrdinate } = getShipContainerElCoords(shipContainerEl);
				const isInBattleField = (bfStartX <= startAbscissa && bfEndX >= endAbscissa) && (bfStartY <= startOrdinate && bfEndY >= endOrdinate);
				if (isInBattleField) {
					const shipEls = [ ...shipContainerEl.querySelectorAll('.drag_drop_ship') ];
					const hits = [];
					shipEls.forEach(shipEl => {
						const shipElCoords = shipEl.getBoundingClientRect();
						const shipElStartX = shipElCoords.x;
						const shipElStartY = shipElCoords.y;
						for (let fieldId in fieldCoords) {
							const { fieldStartX, fieldStartY, fieldEndX, fieldEndY } = fieldCoords[fieldId];
							const isShipBetweenX = shipElStartX > fieldStartX && shipElStartX < fieldEndX;
							const isShipBetweenY = shipElStartY > fieldStartY && shipElStartY < fieldEndY;
							const isShipInField = isShipBetweenX && isShipBetweenY;
							if (isShipInField) hits.push(fieldId);
						}
					});
					const fieldEls = getFieldEls();
					removeHitAndOccupiedStyles(fieldEls);
					const occupiedFields = getOccupiedFields();
					const reservedFields = getReservedCoords(hits, shipContainerEl);
					reservedFields.forEach(reservedField => {
						const fieldEl = fieldEls.find(fieldEl => +fieldEl.fieldId === reservedField);
						if (fieldEl) fieldEl.classList.add('hit');
						const occupiedField = occupiedFields.find(field => +field === reservedField);
						if (occupiedField) {
							const occupiedFieldEl = fieldEls.find(fieldEl => fieldEl.fieldId === occupiedField);
							if (occupiedFieldEl) occupiedFieldEl.classList.add('occupied');
						}
					});
					hits.forEach(hit => {
						const occupiedField = occupiedFields.find(field => field === hit);
						if (occupiedField) {
							const occupiedFieldEl = fieldEls.find(fieldEl => fieldEl.fieldId === occupiedField);
							if (occupiedFieldEl) occupiedFieldEl.classList.add('occupied');
						}
					});
				}
			}

			const rotateShip = () => shipContainerEl.classList.toggle('rotate');
			window.addEventListener('mousemove', moveShip);
			window.addEventListener('wheel', rotateShip);
			const cancelEventListeners = e => {
				window.removeEventListener('mousemove', moveShip);
				window.removeEventListener('mouseup', cancelEventListeners);
				window.removeEventListener('wheel', rotateShip);
				const { startAbscissa, startOrdinate, endAbscissa, endOrdinate } = getShipContainerElCoords(shipContainerEl);
				// const isInBattleField = (bfStartX <= startAbscissa && bfEndX >= endAbscissa) && (bfStartY <= startOrdinate && bfEndY >= endOrdinate);
				const isInBattleField = (bfStartX <= startAbscissa && bfEndX >= endAbscissa) && (bfStartY <= startOrdinate && bfEndY >= endOrdinate);
				const fieldEls = getFieldEls();
				removeHitAndOccupiedStyles(fieldEls);
				if (isInBattleField) {
					const shipEls = [ ...shipContainerEl.querySelectorAll('.drag_drop_ship') ];
					const shipSize = shipEls.length;
					const hits = [];
					let count = 0;
					shipEls.forEach(shipEl => {
						const shipElCoords = shipEl.getBoundingClientRect();
						const shipElStartX = shipElCoords.x;
						const shipElStartY = shipElCoords.y;
						for (let fieldId in fieldCoords) {
							const { fieldStartX, fieldStartY, fieldEndX, fieldEndY } = fieldCoords[fieldId];
							const isShipBetweenX = shipElStartX > fieldStartX && shipElStartX < fieldEndX;
							const isShipBetweenY = shipElStartY > fieldStartY && shipElStartY < fieldEndY;
							const isShipInField = isShipBetweenX && isShipBetweenY;
							if (isShipInField) {
								hits.push(fieldId);
								count++;
							}
						}
					});
					if (count === shipSize) {
						const occupiedFields = getOccupiedFields();
						const reservedFields = getReservedCoords(hits, shipContainerEl);
						let isPlaceNotEmpty = false;

						reservedFields.forEach(reservedField => isFieldOccupied(reservedField, occupiedFields) ? isPlaceNotEmpty = true : false);
						hits.forEach(hit => isFieldOccupied(hit, occupiedFields) ? isPlaceNotEmpty = true : false);

						if (isPlaceNotEmpty) return returnShipToStartPlace(shipContainerEl);
						window.shipsOnBattleField[shipContainerEl.id] = hits;
						const firstHitId = hits[0];
						const coordsFirstHit = fieldCoords[firstHitId];
						const { fieldStartX, fieldStartY, fieldEndX, fieldEndY } = coordsFirstHit;
						const currentTranslate = shipContainerEl.style.transform;
						const regExp = new RegExp(/-?\d+\.?/, 'g');
						const currentTranslateValues = currentTranslate.match(regExp);
						let firstMatch = currentTranslateValues[0];
						const isFirstMatchFloat = firstMatch[firstMatch.length - 1] === '.';
						let secondMatch = isFirstMatchFloat ? currentTranslateValues[2] : currentTranslateValues[1];
						const isSecondMatchFloat = secondMatch[secondMatch.length - 1] === '.';
						firstMatch = isFirstMatchFloat ? currentTranslateValues[0] + currentTranslateValues[1] : currentTranslateValues[0];
						secondMatch = isSecondMatchFloat ?
							(isFirstMatchFloat ? currentTranslateValues[2] + currentTranslateValues[3] : currentTranslateValues[1] + currentTranslateValues[2])
							:
							(isFirstMatchFloat ? currentTranslateValues[2] : currentTranslateValues[1]);
						const diffX = startAbscissa - fieldStartX;
						const diffY = startOrdinate - fieldStartY;
						const correctTranslateX = firstMatch - diffX;
						const correctTranslateY = secondMatch - diffY;
						shipContainerEl.style.transform = `translate(${ correctTranslateX }px, ${ correctTranslateY }px)`;
						const playerShips = model.player.ships;
						const playerShip = playerShips.find(playerShip => playerShip.shipId === +shipContainerEl.id);
						playerShip.location = hits;
						isDisableStartGameButton();
					}
				}
				else {
					return returnShipToStartPlace(shipContainerEl);
				}
			}
			window.addEventListener('mouseup', cancelEventListeners);
		});

		dragDropContainerEl.append(shipContainerEl);

	});
	mainContainerEl.append(dragDropContainerEl);
}

const getFieldCoords = () => {
	const fieldEls = getFieldEls();
	const fieldElsLength = fieldEls.length;
	const fieldCoords = {};
	let bfStartX = null;
	let bfStartY = null;
	let bfEndX = null;
	let bfEndY = null;
	fieldEls.forEach((fieldEl, i) => {
		const fieldId = fieldEl.fieldId;
		const fieldElCoords = fieldEl.getBoundingClientRect();
		const fieldElWidth = fieldEl.offsetWidth;
		const fieldElHeight = fieldEl.offsetHeight;
		const fieldStartX = fieldElCoords.x;
		const fieldStartY = fieldElCoords.y;
		const fieldEndX = fieldStartX + fieldElWidth;
		const fieldEndY = fieldStartY + fieldElHeight;
		if (i === 0) {
			bfStartX = fieldStartX;
			bfStartY = fieldStartY;
		}
		if (i === fieldElsLength - 1) {
			bfEndX = fieldEndX;
			bfEndY = fieldEndY;
		}
		fieldCoords[fieldId] = { fieldStartX, fieldStartY, fieldEndX, fieldEndY };
	});
	return { battleField: { bfStartX, bfStartY, bfEndX, bfEndY }, fieldCoords };
}

const getReservedCoords = (hits, shipContainerEl) => {
	const isUpShip = shipContainerEl.classList.contains('rotate');
	const firstHit = hits[0];
	const lastHit = hits[hits.length - 1];
	const reservedFields = [];
	if (isUpShip) {
		const upperCoord = firstHit - 10;
		const upperLeftCoord = firstHit - 11;
		const upperRightCoord = firstHit - 9;
		const bottomCoord = +lastHit + 10;
		const bottomLeftCoord = +lastHit + 9;
		const bottomRightCoord = +lastHit + 11;
		reservedFields.push(upperCoord, upperLeftCoord, upperRightCoord, bottomCoord, bottomLeftCoord, bottomRightCoord);
		for (let i = 0; i < hits.length; i++) {
			const hit = hits[i];
			const leftCoord = hit - 1;
			const rightCoord = +hit + 1;
			reservedFields.push(leftCoord, rightCoord);
		}
	}
	else {
		const leftCoord = firstHit - 1;
		const leftUpCoord = firstHit - 1 - 10;
		const leftDownCoord = firstHit - 1 + 10;

		const rightCoord = +lastHit + 1;
		const rightUpCoord = +lastHit + 1 - 10;
		const rightDownCoord = +lastHit + 1 + 10;
		reservedFields.push(leftCoord, leftUpCoord, leftDownCoord, rightCoord, rightUpCoord, rightDownCoord);
		for (let i = 0; i < hits.length; i++) {
			const hit = hits[i];
			const upCoord = hit - 10;
			const bottomCoord = +hit + 10;
			reservedFields.push(upCoord, bottomCoord);
		}
	}
	return reservedFields;
}

const getFieldEls = () => {
	return [ ...mainContainerEl.querySelectorAll('.field') ];
}

const removeHitAndOccupiedStyles = fieldEls => {
	if (!fieldEls || !fieldEls.length) return;
	fieldEls.forEach(fieldEl => {
		fieldEl.classList.remove('hit');
		fieldEl.classList.remove('occupied');
	});
}

const getOccupiedFields = () => {
	const shipsOnBattleField = window.shipsOnBattleField;
	const occupiedFields = [];
	for (let ship in shipsOnBattleField) {
		if (shipsOnBattleField.hasOwnProperty(ship)) occupiedFields.push(...shipsOnBattleField[ship]);
	}
	return occupiedFields;
}

const setOccupiedField = () => {
	const playerShips = model.player.ships;
	playerShips.forEach(playerShip => {
		const { shipId, location } = playerShip;
		window.shipsOnBattleField[shipId] = location;
	})
}

const returnShipToStartPlace = shipContainerEl => {
	shipContainerEl.style.transform = 'translate(0px, 0px)';
	shipContainerEl.classList.remove('rotate');
	const shipCoords = window.shipsOnBattleField[shipContainerEl.id];
	const ship = model.player.ships.find(ship => ship.shipId === +shipContainerEl.id);
	if (ship) ship.location = [];
	if (shipCoords) delete window.shipsOnBattleField[shipContainerEl.id];
	isDisableStartGameButton();
}

const isDisableStartGameButton = () => {
	const startGameButton = mainContainerEl.querySelector('.start_game_button');
	const playerShips = model.player.ships;
	let isDisable = false;
	playerShips.forEach(playerShip => {
		const { location } = playerShip;
		if (!location.length) isDisable = true;
	});
	if (isDisable) startGameButton.classList.add('disabled');
	else startGameButton.classList.remove('disabled');
}

const isFieldOccupied = (hit, occupiedFields) => {
	const occupiedField = occupiedFields.find(field => +field === hit);
	return !!occupiedField;
}

const getShipContainerElCoords = shipContainerEl => {
	const shipCoords = shipContainerEl.getBoundingClientRect();
	const shipContainerElWidth = shipContainerEl.offsetWidth;
	const shipContainerElHeight = shipContainerEl.offsetHeight;
	const startAbscissa = shipCoords.x;
	const startOrdinate = shipCoords.y;
	const endAbscissa = startAbscissa + shipContainerElWidth;
	const endOrdinate = startOrdinate + shipContainerElHeight;
	return { startAbscissa, startOrdinate, endAbscissa, endOrdinate };
}

const getShipContainerEls = () => {
	return [ ...mainContainerEl.querySelectorAll('.drag_drop_ship_container') ];
}

const returnOnPlaceAllShips = () => {
	const shipContainerEls = getShipContainerEls();
	shipContainerEls.forEach(shipContainerEl => returnShipToStartPlace(shipContainerEl));
}


const setGameMode = isWithBot => {
	control.isWithBot = isWithBot;
	model.player = { firePlayer };
	if (isWithBot) model.bot = { fireBot };
	control.history.push('main');
	if (isWithBot) renderChooseDifficulty();
	else renderChooseFieldSize();
}


const setFieldSize = size => {
	control.size = size;
	control.history.push('sizeField');
	const battleFieldEl = createBattleField(size);
	mainContainerEl.append(battleFieldEl);
	control.createShips('player');
	if (control.isWithBot) control.createShips('bot');
	renderShipsToDragDrop();
	renderOptionButtons();
}


const setDifficulty = difficulty => {
	control.difficulty = difficulty;
	control.history.push('difficulty');
	renderChooseFieldSize();
}


const startGame = () => {
	const size = control.size;
	const botBattleFieldEl = createBattleField(size);
	const botContainerEl = document.createElement('div');
	botContainerEl.addEventListener('click', e => {
		const target = e.target;
		if (!target.classList.contains('field')) return;
		const fieldId = target.fieldId;
		model.player.firePlayer(fieldId);
	});
	botContainerEl.append(botBattleFieldEl);
	botContainerEl.classList.add('bot');

	const playerBattleFieldEl = createBattleField(size);
	const playerContainerEl = document.createElement('div');
	playerContainerEl.classList.add('player');
	playerContainerEl.append(playerBattleFieldEl);

	mainContainerEl.append(...[ botContainerEl, playerContainerEl ]);
	mainContainerEl.classList.add('pve_battle');
	const isWithBot = control.isWithBot;
	control.history.push('battleField');
	if (isWithBot) {
		const bot = model.bot;
		bot.ships.forEach(ship => control.randomGenerateShip('bot', ship));
		delete bot.borders;
		delete bot.failCounter;
	}
	const fieldEls = [ ...playerBattleFieldEl.querySelectorAll('.field') ];
	const playerShips = model.player.ships;
	playerShips.forEach(playerShip => {
		const { location } = playerShip;
		location.forEach(shipLocation => {
			const fieldEl = fieldEls.find(fieldEl => fieldEl.fieldId === shipLocation);
			if (fieldEl) fieldEl.classList.add('ship');
		})
	});
}

const returnToPrevStage = stage => {
	const isWithBot = control.isWithBot;
	switch (stage) {
		case 'main':
			control.isWithBot = null;
			if (model.bot) delete model.bot;
			delete model.player;
			renderGameModeButtons();
			break;
		case 'difficulty':
			control.difficulty = null;
			renderChooseDifficulty();
			break;
		case 'sizeField':
			control.size = null;
			delete model.player.ships;
			if (isWithBot) delete model.bot.ships;
			renderChooseFieldSize();
			break;
		case 'battleField':
			const size = control.size;
			const battleFieldEl = createBattleField(size);
			mainContainerEl.append(battleFieldEl);
			mainContainerEl.classList.remove('pve_battle');
			renderShipsToDragDrop();
			renderOptionButtons();
			setShipStyles('player');
			isDisableStartGameButton();
			if (isWithBot) {
				model.bot.ships.forEach(ship => {
					ship.location = [];
					delete ship.reservedCoords;
				})
			}
			break;
	}
}

window.onload = () => {
	renderGameModeButtons();
	// setFieldSize(10);
	const backEl = document.querySelector('.back');
	backEl.addEventListener('click', e => {
		const lastHistory = control.history.pop();
		if (lastHistory) {
			while (mainContainerEl.firstChild) mainContainerEl.firstChild.remove();
			returnToPrevStage(lastHistory);
		}
	});
}



window.control = control;
window.model = model;
window.view = view;


