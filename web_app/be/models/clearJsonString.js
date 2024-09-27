
function cleanJsonString(inputString) {
    // Remove leading and trailing whitespace
    let cleaned = inputString.trim();
  
    // Remove "```json" or "```" from the beginning if present
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '');
  
    // Remove "```" from the end if present
    cleaned = cleaned.replace(/\s*```$/, '');
  
    // Remove "json" from the beginning if still present
    cleaned = cleaned.replace(/^json\s*/, '');
  
    return cleaned;
  }


module.exports = cleanJsonString