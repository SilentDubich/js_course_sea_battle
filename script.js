const mainContainerEl = document.querySelector('.content');

const model = {

};
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
		const freePlaces = character.freePlacesToShips;
		const places = [ ...freePlaces ];
		const freePlacesCount = freePlaces.length;

		ship.location = [];
		const borders = [];
		let position = Math.floor(Math.random() * freePlacesCount);
		const chosenPlace = freePlaces[position];
		if (!chosenPlace) {
			character.freePlacesToShips = [];
			const fields = [ ...mainContainerEl.querySelectorAll('.field') ];
			fields.forEach(field => character.freePlacesToShips.push(field.fieldId));
			character.ships.forEach(ship => control.randomGenerateShip(forWhat, ship));
		}
		const rowAndCol = chosenPlace.split('');

		const row = +rowAndCol[0];
		const col = +rowAndCol[1];
		const generateDirections = [];

		const canGenerateUp = row - shipSize >= 0;
		const canGenerateRight = col + shipSize < 10;
		const canGenerateDown = row + shipSize < 10;
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

				borders.push(upBorder, upLeftBorder, upRightBorder, downBorder, downLeftBorder, downRightBorder);
				for (let i = 0; i < shipSize; i++) {
					const coordination = (row - i).toString() + col.toString();
					if (freePlaces.indexOf(coordination) === -1) return control.randomGenerateShip(forWhat, ship);
					leftBorder = (row - i).toString() + (col - 1).toString();
					rightBorder = (row - i).toString() + (col + 1).toString();
					borders.push(leftBorder, rightBorder, coordination);
					ship.location.push(coordination);
				}
				break;
			case 'right':
				leftBorder = row.toString() + (col - 1).toString();
				upLeftBorder = (row + 1).toString() + (col - 1).toString();
				downLeftBorder = (row - 1).toString() + (col - 1).toString();

				rightBorder = row.toString() + (col + shipSize).toString();
				upRightBorder = (row + 1).toString() + (col + shipSize).toString();
				downRightBorder = (row - 1).toString() + (col + shipSize).toString();

				borders.push(leftBorder, upLeftBorder, downLeftBorder, rightBorder, upRightBorder, downRightBorder);
				for (let i = 0; i < shipSize; i++) {
					const coordination = row.toString() + (col + i).toString();
					if (freePlaces.indexOf(coordination) === -1) return control.randomGenerateShip(forWhat, ship);
					upBorder = (row + 1).toString() + (col + i).toString();
					downBorder = (row - 1).toString() + (col + i).toString();
					borders.push(upBorder, downBorder, coordination);
					ship.location.push(coordination);
				}
				break;
			case 'down':
				upBorder = (row - 1).toString() + col.toString();
				upLeftBorder = (row - 1).toString() + (col - 1).toString();
				upRightBorder = (row - 1).toString() + (col + 1).toString();

				downBorder = (row + shipSize).toString() + col.toString();
				downLeftBorder = (row + shipSize).toString() + (col - 1).toString();
				downRightBorder = (row + shipSize).toString() + (col + 1).toString();

				borders.push(upBorder, upLeftBorder, upRightBorder, downBorder, downLeftBorder, downRightBorder);
				for (let i = 0; i < shipSize; i++) {
					const coordination = (row + i).toString() + col.toString();
					if (freePlaces.indexOf(coordination) === -1) return control.randomGenerateShip(forWhat, ship);
					leftBorder = (row + i).toString() + (col - 1).toString();
					rightBorder = (row + i).toString() + (col + 1).toString();
					borders.push(leftBorder, rightBorder, coordination);
					ship.location.push(coordination);
				}
				break;
			case 'left':
				leftBorder = row.toString() + (col - shipSize).toString();
				upLeftBorder = (row + 1).toString() + (col - shipSize).toString();
				downLeftBorder = (row - 1).toString() + (col - shipSize).toString();

				rightBorder = row.toString() + (col + 1).toString();
				upRightBorder = (row + 1).toString() + (col + 1).toString();
				downRightBorder = (row - 1).toString() + (col + 1).toString();

				borders.push(leftBorder, upLeftBorder, downLeftBorder, rightBorder, upRightBorder, downRightBorder);
				for (let i = 0; i < shipSize; i++) {
					const coordination = row.toString() + (col - i).toString();
					if (freePlaces.indexOf(coordination) === -1) return control.randomGenerateShip(forWhat, ship);
					upBorder = (row + 1).toString() + (col - i).toString();
					downBorder = (row - 1).toString() + (col - i).toString();
					borders.push(upBorder, downBorder, coordination);
					ship.location.push(coordination);
				}
				break;
		}
		deleteFromFreePlaces(borders, 'player');
		console.group();
		console.log('borders', borders)
		console.log('freePlaces', places);
		console.log('ship', ship);
		console.groupEnd();

	},
	createShips: forWhat => {
		const size = control.size;
		model[forWhat].ships = [
			{ location: [], size: 3, hits: 0, isSunk: false },
			{ location: [], size: 3, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false }
		];
		if (size === 10) model[forWhat].ships.unshift({ location: [], size: 4, hits: 0, isSunk: false });
	}
};

const deleteFromFreePlaces = (coords, forWhat) => {
	const freePlaces = model[forWhat].freePlacesToShips;
	coords.forEach(coord => {
		const coordIndex = freePlaces.findIndex(place => place === coord);
		if (coordIndex) freePlaces.splice(coordIndex, 1);
	})
}

const setShipStyles = (forWhat) => {
	const character = model[forWhat];
	const charactersShips = character.ships;
	const coordsForStyles = [];
	charactersShips.forEach(ship => coordsForStyles.push(...ship.location));
	const fields = [ ...mainContainerEl.querySelectorAll('.field') ];
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
	mainContainerEl.append(battleFieldEl);
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
			model.player.freePlacesToShips.push(fieldId);
			if (control.isWithBot) model.bot.freePlacesToShips.push(fieldId);
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
	fieldSizeButtonSeven.innerText = '7 X 7';
	fieldSizeButtonSeven.addEventListener('click', e => {
		setFieldSize(7);
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
		model.player.freePlacesToShips = [];
		const fields = [ ...mainContainerEl.querySelectorAll('.field') ];
		fields.forEach(field => model.player.freePlacesToShips.push(field.fieldId));
		model.player.ships.forEach(ship => control.randomGenerateShip("player", ship));
		setShipStyles('player');
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
	model.player = {};
	model.player.freePlacesToShips = [];
	if (isWithBot) {
		model.bot = {};
		model.bot.freePlacesToShips = [];
	}
	control.history.push('main');
	if (isWithBot) renderChooseDifficulty();
	else renderChooseFieldSize();
}

const setFieldSize = size => {
	control.size = size;
	control.history.push('sizeField');
	createBattleField(size);
	renderOptionButtons();
}

const setDifficulty = difficulty => {
	control.difficulty = difficulty;
	control.history.push('difficulty');
	renderChooseFieldSize();
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
			model.player.freePlacesToShips = [];
			delete model.player.ships;
			if (isWithBot) {
				delete model.bot.ships;
				model.bot.freePlacesToShips = [];
			}
			renderChooseFieldSize();
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


