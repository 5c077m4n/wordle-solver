import {
	getCommonLettersPositionScore,
	getCommonLettersScore,
	getUniquenessScore,
} from "./src/word-scores.ts";
import { getRandomWord, WORDS } from "./src/words.ts";

const ATTEMPTS = 6;

type GuessResponse = {
	letter: string;
	response: "in-slot" | "in-word" | "not-in-word";
}[];

function getMostLikelyNextWord(filters: GuessResponse[]): string {
	const relevantWords = WORDS.filter((word) => {
		for (const wordFilter of filters) {
			for (const letterFilter of wordFilter) {
				for (const char of word) {
					// BUG: this filter is wrong - doens't get correct words
					if (
						letterFilter.letter === char &&
						(letterFilter.response === "not-in-word" ||
							letterFilter.response === "in-word")
					) {
						return false;
					}
				}
			}
		}
		return true;
	});
	if (!relevantWords.length) {
		throw Error("Could not find any more words...");
	}

	// TODO: remove sort if favor of just selecting the heighest word's score
	const sortedRelevantWords = relevantWords.sort((a, b) => {
		return (
			getCommonLettersPositionScore(a, relevantWords) -
				getCommonLettersPositionScore(b, relevantWords) ||
			getCommonLettersScore(a, relevantWords) -
				getCommonLettersScore(b, relevantWords) ||
			getUniquenessScore(a) - getUniquenessScore(b)
		);
	});
	return sortedRelevantWords[0];
}

function validateGuess(guess: string, chosen: string): GuessResponse {
	const response: GuessResponse = [];

	for (let i = 0; i < guess.length; i++) {
		const letter = guess[i];

		if (!chosen.includes(letter)) {
			response.push({ letter, response: "not-in-word" });
		} else if (letter === chosen.charAt(i)) {
			response.push({ letter, response: "in-slot" });
		} else {
			response.push({ letter, response: "in-word" });
		}
	}

	return response;
}

function main() {
	const chosenWord = getRandomWord();
	const guessResponses: GuessResponse[] = [];

	for (let i = 1; i <= ATTEMPTS; i++) {
		const nextWord = getMostLikelyNextWord(guessResponses);

		const guessResponse = validateGuess(nextWord, chosenWord);
		// TODO: Aggregate reponses into a more compact data struct
		guessResponses.push(guessResponse);

		if (guessResponse.every((resp) => resp.response === "in-slot")) {
			console.info(`You win! You guessed ${chosenWord} correctly!`);
			console.info(`It took ${i} attempts`);
			return;
		}
	}

	console.error("Game over...", `You missed the word "${chosenWord}"`);
}

main();
