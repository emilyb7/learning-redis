module.exports = (_, response) => {
  console.log("home");
  response.file('./public/index.html');
};
