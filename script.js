const mainContainerEl = document.querySelector('.content');

const model = {};

const view = {};

const control = {
	history: [],
	difficulty: null,
	size: null,
	totalShoots: null,
	totalShipSunks: null,
	isWithBot: null,
	isStarted: false,
	randomGenerateShip: (forWhat, ship) => {
		const size = control.size;
		const shipSize = ship.size;
		const character = model[forWhat];

		if (character.failCounter === 10) {
			character.failCounter = 0;
			deleteShipStyles();
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
						return control.randomGenerateShip(forWhat, ship);
					}

					leftBorder = (row - i).toString() + (col - 1).toString();
					rightBorder = (row - i).toString() + (col + 1).toString();
					borders.push(leftBorder, rightBorder, coordination);
					ship.location.push(coordination);
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
						return control.randomGenerateShip(forWhat, ship);
					}

					upBorder = (row + 1).toString() + (col - i).toString();
					downBorder = (row - 1).toString() + (col - i).toString();
					borders.push(upBorder, downBorder, coordination);
					ship.location.push(coordination);
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
	}
};

const firePlayer = coord => {
	const bot = model.bot;
	const botShips = bot.ships;
	const enemyShip = botShips.find(ship => ship.location.indexOf(coord) !== -1);
	const botField = mainContainerEl.querySelector('.bot');
	const botFields = [ ...botField.querySelectorAll('.field') ];
	const targetField = botFields.find(field => field.fieldId === coord);

	if (!enemyShip) {
		const isWasHits = targetField.classList.contains('miss') || targetField.classList.contains('hit');

		if (isWasHits) return;
		else return targetField.classList.add('miss');

		return;
	}

	const locationIndex = enemyShip.location.findIndex(loc => loc === coord);
	enemyShip.location.splice(locationIndex, 1);
	enemyShip.hits++;
	targetField.classList.add('hit');
	if (enemyShip.hits === enemyShip.size) {
		enemyShip.reservedCoords.forEach(resCoord => {
			const field = botFields.find(botField => botField.fieldId === resCoord);
			if (field) field.classList.add('bomb');
		})
		enemyShip.isSunk = true;
	}
}


const setShipStyles = (forWhat) => {
	const character = model[forWhat];
	const charactersShips = character.ships;
	const coordsForStyles = [];
	charactersShips.forEach(ship => coordsForStyles.push(...ship.location));
	const playerField = mainContainerEl.querySelector('.player');
	let fields;
	if (playerField) fields = [ ...playerField.querySelectorAll('.field') ];
	else fields = [ ...mainContainerEl.querySelectorAll('.field') ];
	if (!fields) return;
	coordsForStyles.forEach(coord => {
		fields.forEach(field => {
			if (field.fieldId === coord) {
				field.classList.add('ship');
			}
		})
	})
}

const deleteShipStyles = () => {
	const fields = [ ...mainContainerEl.querySelectorAll('.field') ];
	fields.forEach(field => field.classList.remove('ship'));
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
	// mainContainerEl.append(battleFieldEl);
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
		control.createShips('player');
		if (control.isWithBot) control.createShips('bot');
		chooseFieldContainer.remove();
	});
	const fieldSizeButtonTen = document.createElement('div');
	fieldSizeButtonTen.classList.add('field_size_button', 'button');
	fieldSizeButtonTen.innerText = '10 X 10';
	fieldSizeButtonTen.addEventListener('click', e => {
		setFieldSize(10);
		control.createShips('player');
		if (control.isWithBot) control.createShips('bot');
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
		deleteShipStyles();
		model.player.failCounter = 0;
		model.player.ships.forEach(ship => ship.location = []);
		model.player.ships.forEach(ship => control.randomGenerateShip("player", ship));
		delete model.player.failCounter;
		delete model.player.borders;
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
	const chooseDifficulty = document.createElement('div');
	chooseDifficulty.classList.add('choose_difficulty');
	const difficultyTextEl = document.createElement('div');
	difficultyTextEl.classList.add('difficulty_text');
	difficultyTextEl.innerText = 'Выберите уровень сложности:';
	const difficultyContainer = document.createElement('div');
	difficultyContainer.classList.add('difficulty_container');
	difficulties.forEach(difficulty => {
		const difficultyEl = document.createElement('div');
		difficultyEl.classList.add('button', 'difficulty');
		difficultyEl.innerText = difficulty;
		difficultyEl.addEventListener('click', e => {
			setDifficulty(difficulty);
			chooseDifficulty.remove();
		});
		difficultyContainer.append(difficultyEl);
	});
	chooseDifficulty.append(...[ difficultyTextEl, difficultyContainer ]);
	mainContainerEl.append(chooseDifficulty);
}






const setGameMode = isWithBot => {
	control.isWithBot = isWithBot;
	model.player = { firePlayer };
	if (isWithBot) model.bot = {};
	control.history.push('main');
	if (isWithBot) renderChooseDifficulty();
	else renderChooseFieldSize();
}

const setFieldSize = size => {
	control.size = size;
	control.history.push('sizeField');
	const battleFieldEl =  createBattleField(size);
	mainContainerEl.append(battleFieldEl);
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
	setShipStyles('player');
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
			renderOptionButtons();
			setShipStyles('player');
			break;
	}
}

window.onload = () => {
	renderGameModeButtons();
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


