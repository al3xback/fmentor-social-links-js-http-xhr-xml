import { sendHttpRequest } from './util.js';

const mainContainerEl = document.querySelector('main .container');
const cardTemplate = document.getElementById('card-template');

const URL =
	'https://gist.githubusercontent.com/al3xback/f296d84690a6ef99b03aa475d9e1a764/raw/7d8d2eab2ddc69bf15f1f3f351120284bf776d71/social-links-data.xml';

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const cardDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (el) => {
		return cardDoc.getElementsByTagName(el)[0].childNodes[0].nodeValue;
	};

	const title = getElementValue('name');
	const subtitle = getElementValue('location');
	const desc = getElementValue('job');

	const cardEl = document.importNode(cardTemplate.content, true);

	const cardTitleEl = cardEl.querySelector('.card__title');
	cardTitleEl.textContent = title;

	const cardSubtitleEl = cardEl.querySelector('.card__subtitle');
	cardSubtitleEl.textContent = subtitle;

	const cardDescEl = cardEl.querySelector('.card__desc');
	cardDescEl.textContent = `"${desc}."`;

	mainContainerEl.appendChild(cardEl);
};

sendHttpRequest('GET', URL, renderCardContent);
