function trimSkills(data) {
    data = JSON.parse(data);
    // Check if data and skills exist
    if (data && data.skills && Array.isArray(data.skills)) {
      // If there are more than 6 skill categories, trim the array
      console.log("LENGTH", data.skills.length)
      if (data.skills.length > 6) {
        data.skills = data.skills.slice(0, 6);
      }
    }
    return data;
  }

  module.exports = trimSkills