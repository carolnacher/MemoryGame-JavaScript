// This function shuffles the elements of an array using the Fisher-Yates algorithm
// Start from the end of the array and iterate backwards
export function shuffle(array) {
  
  for (let i = array.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [array[i], array[j]] = [array[j], array[i]];
  }
  
  return array;
}
