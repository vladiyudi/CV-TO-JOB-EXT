function capitalizeWords(str) {
    // Split the string into an array of words
    return str
      .split(' ')
      // Capitalize the first letter of each word and make the rest lowercase
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      // Join the words back into a string
      .join(' ');
  }

module.exports = { capitalizeWords }