const axios = require('axios');

module.exports = async () => {
    const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/1FSgwRH0c4Ih24OhmUXA3k463NSm85RyJZ64gR3SYsVE/values/a:b?key=AIzaSyCHxf_3-012SHlKwYof5jF78DcMYBsd5ZM`
    );

    console.log(`Spreadsheet response status code: ${response.status}`);

    console.log(`Spreadsheeet response data:`, response.data.values);

    return response.data.values;
};
