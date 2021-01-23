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
	randomGenerateShips: forWhat => {
		let position = Math.floor(Math.random() * 2);
		console.log('lol')
	},
	createShips: forWhat => {
		const size = control.size;
		model[ forWhat ].ships = [
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 1, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 2, hits: 0, isSunk: false },
			{ location: [], size: 3, hits: 0, isSunk: false },
			{ location: [], size: 3, hits: 0, isSunk: false }
		];
		if (size === 10) model[ forWhat ].ships.push({ location: [], size: 4, hits: 0, isSunk: false });
	}
};

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
		control.randomGenerateShips("player");
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
			delete model.bot;
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


