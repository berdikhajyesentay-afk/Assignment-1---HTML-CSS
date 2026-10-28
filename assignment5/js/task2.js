const MAX_IN_PROGRESS = 3;

const COLUMNS = [
    { id: "todo", title: "To do" },
    { id: "progress", title: "In progress" },
    { id: "done", title: "Done" }
];

const PRIORITY_NAMES = ["", "Low", "Medium", "High"];

const cards = [
    { id: 1, title: "Read the Assignment 5 brief", status: "done", priority: 3, hours: 1, tags: ["planning"], urgent: true },
    { id: 2, title: "Higher or Lower game", status: "progress", priority: 3, hours: 4, tags: ["javascript", "game"], urgent: true },
    { id: 3, title: "Board data in an array", status: "progress", priority: 2, hours: 2, tags: ["javascript"], urgent: false },
    { id: 4, title: "Character creator form", status: "todo", priority: 3, hours: 5, tags: ["javascript", "forms"], urgent: true },
    { id: 5, title: "Style hover and focus states", status: "todo", priority: 2, hours: 2, tags: ["css"], urgent: false },
    { id: 6, title: "Test at 375px and 1280px", status: "todo", priority: 2, hours: 1, tags: ["css", "testing"], urgent: false },
    { id: 7, title: "Check the console for errors", status: "todo", priority: 1, hours: 1, tags: ["testing"], urgent: false },
    { id: 8, title: "Take the screenshots", status: "todo", priority: 1, hours: 1, tags: ["report"], urgent: false },
    { id: 9, title: "Write the rules table", status: "todo", priority: 2, hours: 2, tags: ["report", "forms"], urgent: false },
    { id: 10, title: "Push the code to GitHub", status: "todo", priority: 3, hours: 1, tags: ["git"], urgent: true },
    { id: 11, title: "Practise for the defense", status: "todo", priority: 3, hours: 3, tags: ["planning"], urgent: true }
];

const rulesText = document.querySelector("#rules");
const searchInput = document.querySelector("#search");
const tagSelect = document.querySelector("#tag-filter");
const sortSelect = document.querySelector("#sort");
const summary = document.querySelector("#summary");
const notice = document.querySelector("#notice");
const board = document.querySelector("#board");

function countInColumn(status) {
    let count = 0;
    for (const card of cards) {
        if (card.status === status) {
            count = count + 1;
        }
    }
    return count;
}

function showNotice(text, type) {
    notice.textContent = text;
    notice.classList.remove("message--error", "message--success");
    notice.classList.add("message--" + type);
}

function fillTagOptions() {
    const tags = [];
    for (const card of cards) {
        for (const tag of card.tags) {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        }
    }
    tags.sort();
    for (const tag of tags) {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag;
        tagSelect.append(option);
    }
}

function getVisibleCards() {
    const text = searchInput.value.trim().toLowerCase();
    const tag = tagSelect.value;

    const visible = cards.filter(function (card) {
        const textMatches = card.title.toLowerCase().includes(text);
        const tagMatches = tag === "all" || card.tags.includes(tag);
        return textMatches && tagMatches;
    });

    if (sortSelect.value === "high") {
        visible.sort(function (a, b) {
            return b.priority - a.priority;
        });
    } else if (sortSelect.value === "low") {
        visible.sort(function (a, b) {
            return a.priority - b.priority;
        });
    }
    return visible;
}

function createButton(text, action, card, disabled) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn--small";
    button.textContent = text;
    button.dataset.action = action;
    button.dataset.id = card.id;
    button.disabled = disabled;
    button.setAttribute("aria-label", text + ": " + card.title);
    return button;
}

function createCard(card) {
    const item = document.createElement("li");
    item.className = "task";
    item.classList.add("task--p" + card.priority);
    if (card.status === "done") {
        item.classList.add("task--done");
    }

    const title = document.createElement("h3");
    title.className = "task__title";
    title.textContent = card.title;

    const info = document.createElement("p");
    info.className = "task__info";
    info.textContent = "Priority: " + PRIORITY_NAMES[card.priority] + " · " + card.hours + " h";

    const tagList = document.createElement("ul");
    tagList.className = "task__tags";
    if (card.urgent) {
        const urgent = document.createElement("li");
        urgent.className = "tag tag--urgent";
        urgent.textContent = "urgent";
        tagList.append(urgent);
    }
    for (const tag of card.tags) {
        const tagItem = document.createElement("li");
        tagItem.className = "tag";
        tagItem.textContent = tag;
        tagList.append(tagItem);
    }

    const buttons = document.createElement("div");
    buttons.className = "task__buttons";
    buttons.append(
        createButton("Back", "back", card, card.status === "todo"),
        createButton("Next", "next", card, card.status === "done")
    );

    item.append(title, info, tagList, buttons);
    return item;
}

function renderSummary() {
    let done = 0;
    let hoursLeft = 0;
    for (const card of cards) {
        if (card.status === "done") {
            done = done + 1;
        } else {
            hoursLeft = hoursLeft + card.hours;
        }
    }

    const label = document.createElement("label");
    label.htmlFor = "progress-bar";
    label.className = "summary__label";
    label.textContent = done + " of " + cards.length + " cards done";

    const bar = document.createElement("progress");
    bar.id = "progress-bar";
    bar.max = cards.length;
    bar.value = done;

    const hours = document.createElement("p");
    hours.className = "summary__hours";
    hours.textContent = hoursLeft + " hours of work left";

    summary.replaceChildren(label, bar, hours);
}

function render() {
    const visible = getVisibleCards();
    board.replaceChildren();

    if (visible.length === 0) {
        const empty = document.createElement("p");
        empty.className = "board__empty";
        empty.textContent = "Nothing found. Try another word or choose All tags.";
        board.append(empty);
    }

    for (const column of COLUMNS) {
        const section = document.createElement("section");
        section.className = "column";

        const heading = document.createElement("h2");
        heading.className = "column__title";
        const total = countInColumn(column.id);
        if (column.id === "progress") {
            heading.textContent = column.title + " (" + total + " of " + MAX_IN_PROGRESS + ")";
            section.classList.toggle("column--full", total >= MAX_IN_PROGRESS);
        } else {
            heading.textContent = column.title + " (" + total + ")";
        }

        const list = document.createElement("ul");
        list.className = "column__list";
        for (const card of visible) {
            if (card.status === column.id) {
                list.append(createCard(card));
            }
        }

        section.append(heading);
        if (list.children.length === 0) {
            const empty = document.createElement("p");
            empty.className = "column__empty";
            empty.textContent = "No cards here.";
            section.append(empty);
        } else {
            section.append(list);
        }
        board.append(section);
    }

    renderSummary();
}

function moveCard(id, action) {
    const card = cards.find(function (item) {
        return item.id === id;
    });
    let index = COLUMNS.findIndex(function (column) {
        return column.id === card.status;
    });

    if (action === "next") {
        index = index + 1;
    } else {
        index = index - 1;
    }
    if (index < 0 || index >= COLUMNS.length) {
        return;
    }

    const target = COLUMNS[index];
    if (target.id === "progress" && countInColumn("progress") >= MAX_IN_PROGRESS) {
        showNotice("Blocked: \"In progress\" can hold only " + MAX_IN_PROGRESS + " cards. Finish a card or move one back first.", "error");
        return;
    }

    card.status = target.id;
    showNotice("\"" + card.title + "\" moved to " + target.title + ".", "success");
    render();

    const sameButton = board.querySelector("button[data-id=\"" + id + "\"][data-action=\"" + action + "\"]:not(:disabled)");
    const otherButton = board.querySelector("button[data-id=\"" + id + "\"]:not(:disabled)");
    if (sameButton) {
        sameButton.focus();
    } else if (otherButton) {
        otherButton.focus();
    }
}

rulesText.textContent = "Move the cards with Back and Next. The \"In progress\" column can hold at most " +
    MAX_IN_PROGRESS + " cards. Search by title, filter by tag and sort by priority.";

board.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (button === null) {
        return;
    }
    moveCard(Number(button.dataset.id), button.dataset.action);
});

searchInput.addEventListener("input", render);
tagSelect.addEventListener("change", render);
sortSelect.addEventListener("change", render);

fillTagOptions();
render();
