import nspell from "nspell";
import dictionary from "dictionary-en";

// Spell check function
export const loadSpellChecker = async () => {
  return new Promise((resolve, reject) => {
    dictionary((err, dict) => {
      if (err) return reject(err);
      const spell = nspell(dict);
      resolve(spell);
    });
  });
};

// Returns array of misspelled words
export const getMisspelledWords = async (text) => {
  const spell = await loadSpellChecker();
  const words = text.match(/\b\w+\b/g) || [];
  const misspelled = words.filter((word) => !spell.correct(word));
  return [...new Set(misspelled)]; // remove duplicates
};
  