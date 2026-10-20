/**
 * Data structures for Unit 1, Lesson 6: Country Information File
 * English for Libya Primary 5
 */

export type CountryKey = 'england' | 'india';

export interface LandmarkFact {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  descriptionArabic: string;
  landmarkModelType: 'london-eye' | 'tower-bridge' | 'taj-mahal' | 'palace';
  funFact: string;
  funFactArabic: string;
}

export interface CountryProfile {
  key: CountryKey;
  name: string;
  nameArabic: string;
  flagEmoji: string;
  characterName: string;
  characterNationality: string;
  characterArabic: string;
  characterGreeting: string;
  characterGreetingArabic: string;
  location: string;
  locationArabic: string;
  continent: string;
  continentArabic: string;
  capitalCity: string;
  capitalCityArabic: string;
  biggestCity?: string;
  biggestCityArabic?: string;
  populationFact?: string;
  populationFactArabic?: string;
  languages: string[];
  languagesArabic: string;
  nationalSymbol?: string;
  nationalSymbolArabic?: string;
  famousFor: string[];
  famousForArabic: string;
  landmarks: LandmarkFact[];
  storyParagraphs: {
    english: string;
    arabic: string;
  }[];
}

export interface FactQuestion {
  id: string;
  question: string;
  questionArabic: string;
  answer: string;
  answerArabic: string;
  explanation: string;
  explanationArabic: string;
  country: CountryKey;
  category: 'capital' | 'landmark' | 'city' | 'symbol' | 'culture';
}

export interface InfoFileBlank {
  label: string;
  labelArabic: string;
  fieldKey: string;
  correctAnswer: string;
  options: string[];
  arabicHint: string;
}

export interface InfoFileTemplate {
  countryKey: CountryKey;
  title: string;
  titleArabic: string;
  character: string;
  fields: InfoFileBlank[];
}

export interface DetectiveQuestion {
  id: string;
  statement: string;
  statementArabic: string;
  isFact: boolean;
  correctionIfFake?: string;
  correctionArabic?: string;
  explanation: string;
  country: CountryKey;
}

export interface SortingItem {
  id: string;
  name: string;
  nameArabic: string;
  category: string;
  emoji: string;
  country: CountryKey;
  hint: string;
}

export interface VocabularyWord {
  id: string;
  english: string;
  phonetic: string;
  partOfSpeech: string;
  arabic: string;
  example: string;
  exampleArabic: string;
  countryContext: 'England' | 'India' | 'Both';
}
