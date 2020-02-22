
const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require("html-pdf");
const generateHTML = require("./generateHTML");

const questions = [{
    type: "input",
    name: "username",
    message: "Enter your GitHub username: ",
},
{
    type: "list",
    name: "color",
    message: "Pick a color?",
    choices: ["green", "blue", "pink", "red"],
}];

init();
function init() {
    inquirer
        .prompt(questions)
        .then(function ({ username, color }) {
            const queryURL = `https://api.github.com/users/${username}`;
            const querlURLStar = `https://api.github.com/users/${username}/starred`
            axios.get(queryURL).
                then(function ({ data }) {
                    axios.get(querlURLStar)
                        .then(function (res) {
                            const sCount = res.data.map(element => {
                                return element.stargazers_count
                            });
                            const stars = sCount.length;
                            const params = {
                                color: color,
                                username: data.username,
                                avatar_url: data.avatar_url,
                                name: data.name,
                                location: data.location,
                                bio: data.bio,
                                public_repos: data.public_repos,
                                followers: data.followers,
                                following: data.following,
                                github: data.login,
                                stars: stars,
                                html_url: data.html_url,
                                
                            }
                            pdf.create(generateHTML(params)).toFile('./genPortfolio.pdf', function (err, res) {
                                if (err) throw (err);
                            })
                        })
                })
        })
}