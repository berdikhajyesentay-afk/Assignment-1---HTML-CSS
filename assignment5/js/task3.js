const POINTS_TOTAL = 20;
const SKILL_MAX = 10;

const takenNames = ["Merlin", "Arthas", "Zelda", "Batyr", "Aldar"];

const CLASSES = [
    { id: "warrior", name: "Warrior", skill: "strength", min: 6 },
    { id: "mage", name: "Mage", skill: "magic", min: 6 },
    { id: "rogue", name: "Rogue", skill: "agility", min: 6 },
    { id: "guardian", name: "Guardian", skill: "defense", min: 6 }
];

const SKILLS = [
    { id: "strength", name: "Strength" },
    { id: "magic", name: "Magic" },
    { id: "agility", name: "Agility" },
    { id: "defense", name: "Defense" }
];

const COLORS = ["red", "blue", "green", "purple"];

const form = document.querySelector("#hero-form");
const rulesText = document.querySelector("#rules");
const errorSummary = document.querySelector("#error-summary");
const nameInput = document.querySelector("#name");
const classSelect = document.querySelector("#hero-class");
const colorInputs = document.querySelectorAll("input[name='color']");
const pointsLeft = document.querySelector("#points-left");
const totalError = document.querySelector("#total-error");
const previewCard = document.querySelector("#preview-card");
const previewName = document.querySelector("#preview-name");
const previewClass = document.querySelector("#preview-class");
const previewSkills = document.querySelector("#preview-skills");
const results = document.querySelector("#results");
const resultsEmpty = document.querySelector("#results-empty");
const resultsTitle = document.querySelector("#results-title");

const touched = [];

function findClass(id) {
    return CLASSES.find(function (heroClass) {
        return heroClass.id === id;
    });
}

function getSkillInput(id) {
    return document.querySelector("#" + id);
}

function skillValue(id) {
    const value = Number(getSkillInput(id).value);
    if (Number.isNaN(value)) {
        return 0;
    }
    return value;
}

function skillTotal() {
    let total = 0;
    for (const skill of SKILLS) {
        total = total + skillValue(skill.id);
    }
    return total;
}

function chosenColor() {
    for (const input of colorInputs) {
        if (input.checked) {
            return input.value;
        }
    }
    return "";
}

function isTaken(name) {
    for (const taken of takenNames) {
        if (taken.toLowerCase() === name.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function nameError() {
    const name = nameInput.value.trim();
    if (nameInput.validity.valueMissing) {
        return "Enter a name for your character.";
    }
    if (name.length < 2) {
        return "The name needs at least 2 characters that are not spaces.";
    }
    if (nameInput.validity.tooLong) {
        return "The name can have at most 16 characters.";
    }
    if (isTaken(name)) {
        return "\"" + name + "\" is already taken. Choose another name.";
    }
    return "";
}

function classError() {
    if (classSelect.validity.valueMissing) {
        return "Choose a class.";
    }
    const heroClass = findClass(classSelect.value);
    const value = skillValue(heroClass.skill);
    const mainSkill = SKILLS.find(function (item) {
        return item.id === heroClass.skill;
    });
    if (value < heroClass.min) {
        return "A " + heroClass.name + " needs " + mainSkill.name + " " + heroClass.min + " or more (now " + value + ").";
    }
    for (const skill of SKILLS) {
        if (skillValue(skill.id) > value) {
            return "For a " + heroClass.name + ", " + mainSkill.name + " must be the highest skill, but " +
                skill.name + " is higher (" + skillValue(skill.id) + ").";
        }
    }
    return "";
}

function colorError() {
    if (chosenColor() === "") {
        return "Choose a color.";
    }
    return "";
}

function skillError(id) {
    const input = getSkillInput(id);
    if (input.validity.valueMissing || input.validity.badInput) {
        return "Enter a whole number from 1 to " + SKILL_MAX + ".";
    }
    if (input.validity.rangeUnderflow || input.validity.rangeOverflow) {
        return "Use a number from 1 to " + SKILL_MAX + ".";
    }
    if (input.validity.stepMismatch) {
        return "Use a whole number, without a decimal part.";
    }
    return "";
}

function pointsText(count) {
    if (count === 1) {
        return "1 point";
    }
    return count + " points";
}

function totalErrorText() {
    const total = skillTotal();
    if (total === POINTS_TOTAL) {
        return "";
    }
    if (total < POINTS_TOTAL) {
        return "The skills must add up to exactly " + POINTS_TOTAL + ". You still have " + pointsText(POINTS_TOTAL - total) + " to spend.";
    }
    return "The skills must add up to exactly " + POINTS_TOTAL + ". You used " + pointsText(total - POINTS_TOTAL) + " too many.";
}

function showFieldError(inputs, errorId, message) {
    document.querySelector("#" + errorId).textContent = message;
    for (const input of inputs) {
        input.setAttribute("aria-invalid", message === "" ? "false" : "true");
    }
}

function checkName() {
    const message = nameError();
    showFieldError([nameInput], "name-error", message);
    return message;
}

function checkClass() {
    const message = classError();
    showFieldError([classSelect], "hero-class-error", message);
    return message;
}

function checkColor() {
    const message = colorError();
    showFieldError(colorInputs, "color-error", message);
    return message;
}

function checkSkills() {
    const messages = [];
    let anyTouched = false;
    for (const skill of SKILLS) {
        let message = "";
        if (touched.includes(skill.id)) {
            anyTouched = true;
            message = skillError(skill.id);
        }
        document.querySelector("#" + skill.id + "-error").textContent = message;
        messages.push(message);
    }

    let total = "";
    if (anyTouched) {
        total = totalErrorText();
    }
    totalError.textContent = total;

    for (let i = 0; i < SKILLS.length; i++) {
        const invalid = messages[i] !== "" || (total !== "" && touched.includes(SKILLS[i].id));
        getSkillInput(SKILLS[i].id).setAttribute("aria-invalid", invalid ? "true" : "false");
    }

    messages.push(total);
    return messages;
}

function checkTouched() {
    if (touched.includes("name")) {
        checkName();
    }
    if (touched.includes("heroClass")) {
        checkClass();
    }
    if (touched.includes("color")) {
        checkColor();
    }
    checkSkills();
}

function touch(key) {
    if (!touched.includes(key)) {
        touched.push(key);
    }
}

function updatePreview() {
    const name = nameInput.value.trim();
    previewName.textContent = name === "" ? "Your hero" : name;

    const heroClass = findClass(classSelect.value);
    previewClass.textContent = heroClass === undefined ? "No class yet" : heroClass.name;

    for (const color of COLORS) {
        previewCard.classList.remove("hero--" + color);
    }
    if (chosenColor() !== "") {
        previewCard.classList.add("hero--" + chosenColor());
    }

    previewSkills.replaceChildren();
    for (const skill of SKILLS) {
        previewSkills.append(createSkillRow(skill, skillValue(skill.id)));
    }

    const left = POINTS_TOTAL - skillTotal();
    pointsLeft.classList.remove("points--done", "points--over");
    if (left === 0) {
        pointsLeft.textContent = "All " + POINTS_TOTAL + " points are spent.";
        pointsLeft.classList.add("points--done");
    } else if (left > 0) {
        pointsLeft.textContent = "Points left: " + left + " of " + POINTS_TOTAL;
    } else {
        pointsLeft.textContent = "Too many: " + pointsText(-left) + " over " + POINTS_TOTAL;
        pointsLeft.classList.add("points--over");
    }
}

function createSkillRow(skill, value) {
    const row = document.createElement("li");
    row.className = "skill-row";

    const label = document.createElement("span");
    label.textContent = skill.name + ": " + value;

    const bar = document.createElement("progress");
    bar.max = SKILL_MAX;
    bar.value = Math.min(Math.max(value, 0), SKILL_MAX);
    bar.setAttribute("aria-label", skill.name);

    row.append(label, bar);
    return row;
}

function createCharacter() {
    const name = nameInput.value.trim();
    const heroClass = findClass(classSelect.value);

    const card = document.createElement("article");
    card.className = "hero-card hero--" + chosenColor();

    const title = document.createElement("h3");
    title.className = "hero-card__name";
    title.textContent = name;

    const classText = document.createElement("p");
    classText.className = "hero-card__class";
    classText.textContent = heroClass.name;

    const list = document.createElement("ul");
    list.className = "hero-card__skills";
    for (const skill of SKILLS) {
        list.append(createSkillRow(skill, skillValue(skill.id)));
    }

    card.append(title, classText, list);
    results.prepend(card);
    resultsEmpty.hidden = true;
    takenNames.push(name);
}

function clearErrors() {
    touched.length = 0;
    const errors = document.querySelectorAll(".field__error");
    for (const error of errors) {
        error.textContent = "";
    }
    const inputs = form.querySelectorAll("input, select");
    for (const input of inputs) {
        input.removeAttribute("aria-invalid");
    }
    errorSummary.textContent = "";
}

rulesText.textContent = "Spend exactly " + POINTS_TOTAL + " skill points, each skill from 1 to " + SKILL_MAX +
    ". Every class needs a minimum in its main skill, and the main skill must be the highest. A name can be used only once.";

form.noValidate = true;

nameInput.addEventListener("blur", function () {
    touch("name");
    checkName();
});

classSelect.addEventListener("blur", function () {
    touch("heroClass");
    checkClass();
});

classSelect.addEventListener("change", function () {
    touch("heroClass");
});

for (const input of colorInputs) {
    input.addEventListener("change", function () {
        touch("color");
    });
    input.addEventListener("blur", function () {
        touch("color");
        checkColor();
    });
}

for (const skill of SKILLS) {
    getSkillInput(skill.id).max = SKILL_MAX;
    getSkillInput(skill.id).addEventListener("blur", function () {
        touch(skill.id);
        checkTouched();
    });
}

function updateSummary(count) {
    if (count === 0) {
        errorSummary.textContent = "";
    } else if (count === 1) {
        errorSummary.textContent = "There is 1 error in the form. Fix it to create your character.";
    } else {
        errorSummary.textContent = "There are " + count + " errors in the form. Fix them to create your character.";
    }
}

function onFormChange() {
    updatePreview();
    if (errorSummary.textContent === "") {
        checkTouched();
    } else {
        updateSummary(findProblems().length);
    }
}

function findProblems() {
    const problems = [];
    if (checkName() !== "") {
        problems.push(nameInput);
    }
    if (checkClass() !== "") {
        problems.push(classSelect);
    }
    if (checkColor() !== "") {
        problems.push(colorInputs[0]);
    }
    const skillMessages = checkSkills();
    for (let i = 0; i < SKILLS.length; i++) {
        if (skillMessages[i] !== "") {
            problems.push(getSkillInput(SKILLS[i].id));
        }
    }
    if (skillMessages[SKILLS.length] !== "") {
        problems.push(getSkillInput(SKILLS[0].id));
    }
    return problems;
}

form.addEventListener("input", onFormChange);
form.addEventListener("change", onFormChange);

form.addEventListener("submit", function (event) {
    event.preventDefault();

    touch("name");
    touch("heroClass");
    touch("color");
    for (const skill of SKILLS) {
        touch(skill.id);
    }

    const problems = findProblems();
    updateSummary(problems.length);
    if (problems.length > 0) {
        problems[0].focus();
        return;
    }

    createCharacter();
    form.reset();
    clearErrors();
    updatePreview();
    resultsTitle.focus();
});

updatePreview();
