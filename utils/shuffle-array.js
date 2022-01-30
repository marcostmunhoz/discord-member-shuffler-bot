/**
 * Shuffles array in place. ES6 version
 *
 * @param {Array<T>} array items An array containing the items.
 * 
 * @returns {Array<T>}
 * 
 * @template T
 *
 * @see https://stackoverflow.com/a/6274381
 */
export default function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}