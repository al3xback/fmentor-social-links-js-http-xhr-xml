import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/f296d84690a6ef99b03aa475d9e1a764/raw/87911cdfa5d02d2b695466531d152c70f19a8e02/social-links-data.xml';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const cardHeadTemplate = document.getElementById('card-head-template');
const cardLinkTemplate = document.getElementById('card-link-template');
const cardBodyTemplate = document.getElementById('card-body-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const parser = new DOMParser();
	const dataDoc = parser.parseFromString(data, 'text/xml');

	const getElementValue = (name) => {
		const element = dataDoc.getElementsByTagName(name)[0];
		const hasChildren = !!element.children.length;
		if (hasChildren) {
			return [...element.children].map(
				(item) => item.childNodes[0].nodeValue
			);
		}
		return element.childNodes[0].nodeValue;
	};

	const name = getElementValue('name');
	const location = getElementValue('location');
	const job = getElementValue('job');
	const image = getElementValue('image');
	const socialLinks = getElementValue('social_links').map((link) => {
		const linkInfo = link.split(': ');
		return {
			name: linkInfo[0],
			url: linkInfo[1],
		};
	});

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');

	/* [card head] */
	const cardHeadTemplateNode = document.importNode(
		cardHeadTemplate.content,
		true
	);
	const cardHeadEl = cardHeadTemplateNode.querySelector('.card__head');

	const cardTitleEl = cardHeadEl.querySelector('.card__title');
	cardTitleEl.textContent = name;

	const cardSubtitleEl = cardHeadEl.querySelector('.card__subtitle');
	cardSubtitleEl.textContent = location;

	const cardDescriptionEl = cardHeadEl.querySelector('.card__desc');
	cardDescriptionEl.textContent = `"${job}."`;

	const cardImageEl = cardHeadEl.querySelector('.card__image img');
	cardImageEl.src = './images/' + image;
	cardImageEl.alt = name;

	/* [card body] */
	const cardBodyTemplateNode = document.importNode(
		cardBodyTemplate.content,
		true
	);
	const cardBodyEl = cardBodyTemplateNode.querySelector('.card__body');

	const cardLinksEl = cardBodyEl.querySelector('.card__links');

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

	/* [init] */
	removeLoading();
	cardEl.appendChild(cardHeadTemplateNode);
	cardEl.appendChild(cardBodyTemplateNode);
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
