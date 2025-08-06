import { mostCommonLetterPositions, mostCommonLetters } from "./words.ts";

export function getCommonLettersPositionScore(
	word: string,
	relevantWords: string[],
): number {
	const commonLetterPos = mostCommonLetterPositions(relevantWords);

	let score = 0;
	for (let i = 0; i < word.length; i++) {
		const letter = word[i];
		score += commonLetterPos[letter][i];
	}

	return score;
}

export function getCommonLettersScore(
	word: string,
	relevantWords: string[],
): number {
	const commonLetters = mostCommonLetters(relevantWords);

	let score = 0;
	for (const letter of word) {
		score += commonLetters[letter];
	}

	return score;
}

export function getUniquenessScore(word: string): number {
	return new Set([...word]).size;
}
