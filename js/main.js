import { sendHttpRequest } from './util.js';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const cardLinkTemplate = document.getElementById('card-link-template');
const loadingEl = document.querySelector('.loading');

const URL =
	'https://gist.githubusercontent.com/al3xback/f296d84690a6ef99b03aa475d9e1a764/raw/2c9cecf92fd91600d67f32273c6cf43aeb95684e/social-links-data.xml';

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const dataDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (el) => {
		return dataDoc.getElementsByTagName(el)[0].childNodes[0].nodeValue;
	};

	const name = getElementValue('name');
	const location = getElementValue('location');
	const job = getElementValue('job');
	const image = getElementValue('image');
	const socialLinksEl = dataDoc.getElementsByTagName('social_links')[0];
	const socialLinks = Array.from(socialLinksEl.children).map((link) => {
		const val = link.childNodes[0].nodeValue.split(': ');
		return {
			name: val[0],
			url: val[1],
		};
	});

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');

	const cardImageEl = cardEl.querySelector('.card__image img');
	cardImageEl.src = './images/' + image;
	cardImageEl.alt = name;

	const cardTitleEl = cardEl.querySelector('.card__title');
	cardTitleEl.textContent = name;

	const cardSubtitleEl = cardEl.querySelector('.card__subtitle');
	cardSubtitleEl.textContent = location;

	const cardDescEl = cardEl.querySelector('.card__desc');
	cardDescEl.textContent = `"${job}."`;

	const cardLinksEl = cardEl.querySelector('.card__links');

	for (const socialLink of socialLinks) {
		const { name, url } = socialLink;
		const cardLinkTemplateNode = document.importNode(
			cardLinkTemplate.content,
			true
		);
		const cardLinkEl = cardLinkTemplateNode.querySelector('.card__link');

		const cardLinkAnchorEl = cardLinkEl.querySelector('.btn');
		cardLinkAnchorEl.href = url;
		cardLinkAnchorEl.textContent = name;

		cardLinksEl.appendChild(cardLinkTemplateNode);
	}

	loadingEl.parentElement.removeChild(loadingEl);
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent);
