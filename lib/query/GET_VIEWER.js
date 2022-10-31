const GET_VIEWER = `
query {
  viewer {
    login
		id
  }
}`;

module.exports = GET_VIEWER;