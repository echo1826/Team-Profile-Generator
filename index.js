const fs = require('fs');
const inquire = require('inquirer');
const Engineer = require('./lib/engineer');
const Manager = require('./lib/manager');
const Intern = require('./lib/intern');
const renderHtml = require('./lib/htmlrender');
const renderCss = require('./lib/cssrender');


const teamMembers = [];

const questions = [{
        type: "list",
        message: "Choose the role of the employee:",
        choices: ["Manager", "Intern", "Engineer"],
        name: "employee"
    },
    {
        type: "input",
        message: "What is the name of the employee?",
        name: "employeeName"
    },
    {
        type: "input",
        message: "What is the ID for the employee?",
        name: "id"
    },
    {
        type: "input",
        message: "What is the email for the employee?",
        name: "email"
    },
    {
        type: "input",
        message: "What is the office number for the manager?",
        name: "officeNumber",
        when: (answer) => answer.employee === "Manager"
    },
    {
        type: "input",
        message: "What is the github for the engineer?",
        name: "github",
        when: (answer) => answer.employee === "Engineer"
    },
    {
        type: "input",
        message: "What is the school of the intern?",
        name: "school",
        when: (answer) => answer.employee === "Intern"
    },
    {
        type: "confirm",
        message: "Add a member or quit?",
        // choices:["Add member", "Quit"],
        name: "isFinished"
    }
];

// functions that generate new objects based on user answers
function generateIntern(data) {
    const intern = new Intern(data.employeeName, data.id, data.email, data.school);
    teamMembers.push(intern);
}

function generateEngineer(data) {
    const engineer = new Engineer(data.employeeName, data.id, data.email, data.github);
    teamMembers.push(engineer);
}

function generateManager(data) {
    const manager = new Manager(data.employeeName, data.id, data.email, data.officeNumber);
    teamMembers.push(manager);
}

// gets the obj generated by above functions then deals with obj data putting it onto html
function writeHtml(html) {
    fs.writeFile('./dist/index.html', html, (err) => {
        err ? console.error(err) : console.log("Success!")
    })
    console.log(html);
}

function writeCss(css) {
    fs.writeFile('./dist/style.css', css, (err) => {
        err ? console.error(err) : console.log("Success!")
    })
}

//decides what type of employee will be generated based on user input
function decideEmployee(data) {
    switch (data.employee) {
        case "Manager": {
            generateManager(data);
            break;
        }
        case "Engineer": {
            generateEngineer(data);
            break;
        }
        case "Intern": {
            generateIntern(data);
            break;
        }
    }
}

// asks user questions then calls function that decides what happens based on the data received
function employeeAnswers() {
    inquire
        .prompt(questions)
        .then((response => {
            console.log(response);
            if (!response.isFinished) {
                // same function calls here to generate the employee with the current answers except no init() call
                decideEmployee(response);
                writeCss(renderCss());
                writeHtml(renderHtml(teamMembers));
            } else {
                // function calls to generate the employee before asking next set of questions for new employee
                decideEmployee(response);
                employeeAnswers();
            }
            // writeCss(renderCss());
            
        }));
}

// initializer function
function init() {
    employeeAnswers();
}

init();