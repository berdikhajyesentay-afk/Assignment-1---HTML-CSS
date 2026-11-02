// The party from the picture. Rooms go from left to right, floor 2 first.
// Guests in every room are written from left to right.
const rooms = [
    {
        id: "balcony", name: "Balcony", floor: 2, guests: [
            { name: "Aigerim", color: "green", time: "20:45", aitu: true, things: ["cup", "crumbs"] },
            { name: "Aliya", color: "black", time: "21:15", aitu: false, things: ["phone", "cup"] },
            { name: "Madina", color: "green", time: "22:10", aitu: false, things: ["phone", "bag", "crumbs"] },
            { name: "Ivan", color: "black", time: "20:10", aitu: true, things: ["cup"] }
        ]
    },
    {
        id: "hall", name: "Hall", floor: 2, guests: [
            { name: "Arman", color: "yellow", time: "20:35", aitu: false, things: ["bag", "glasses"] },
            { name: "Sophia", color: "purple", time: "21:20", aitu: true, things: ["phone"] },
            { name: "Dias", color: "green", time: "19:45", aitu: true, things: [] },
            { name: "Bekzat", color: "purple", time: "20:55", aitu: false, things: ["bag", "cup", "crumbs"] },
            { name: "Aruzhan", color: "blue", time: "21:50", aitu: true, things: ["phone"] },
            { name: "Saule", color: "green", time: "21:25", aitu: false, things: ["glasses"] }
        ]
    },
    {
        id: "kitchen", name: "Kitchen", floor: 1, guests: [
            { name: "Nurlan", color: "red", time: "19:40", aitu: true, things: ["phone", "cup"] },
            { name: "Emma", color: "black", time: "20:15", aitu: false, things: ["bag"] },
            { name: "Timur", color: "green", time: "21:05", aitu: true, things: ["phone", "bag", "crumbs"] },
            { name: "Sergey", color: "yellow", time: "20:50", aitu: false, things: [] },
            { name: "Yerlan", color: "red", time: "21:40", aitu: true, things: ["glasses", "phone"] },
            { name: "Kamila", color: "green", time: "20:05", aitu: false, things: ["cup"] }
        ]
    },
    {
        id: "living-room", name: "Living room", floor: 1, guests: [
            { name: "Daniel", color: "blue", time: "19:55", aitu: true, things: ["glasses"] },
            { name: "Zarina", color: "green", time: "21:10", aitu: false, things: ["bag", "phone", "crumbs"] },
            { name: "Natasha", color: "yellow", time: "20:30", aitu: true, things: [] },
            { name: "Askar", color: "black", time: "21:00", aitu: true, things: ["phone"] },
            { name: "Inkar", color: "purple", time: "20:20", aitu: false, things: ["bag"] }
        ]
    }
];

// Miras is not in the picture. He comes in case 18.
const miras = { name: "Miras", color: "blue", time: "21:20", aitu: true, things: ["phone"] };

const icons = { phone: "📱", glasses: "👓", bag: "👜", cup: "☕", crumbs: "🍰" };

// Every case is one jQuery chain. It searches the page, not the array.
const cases = [
    { n: 1, question: "Who is in the hall?", find: function () {
        return $("#hall .guest");
    } },
    { n: 2, question: "Who is dressed in yellow or purple?", find: function () {
        return $(".guest[data-color='yellow'], .guest[data-color='purple']");
    } },
    { n: 3, question: "Which AITU students are upstairs?", find: function () {
        return $(".floor[data-floor='2'] .guest.aitu");
    } },
    { n: 4, question: "Who has glasses or a bag?", find: function () {
        return $(".guest.glasses, .guest.bag");
    } },
    { n: 5, question: "Who came with nothing at all?", find: function () {
        return $(".guest:not(.phone, .glasses, .bag, .cup, .crumbs)");
    } },
    { n: 6, question: "Who has a phone but no bag?", find: function () {
        return $(".guest.phone:not(.bag)");
    } },
    { n: 7, question: "Who arrived between 20:30 and 21:00?", find: function () {
        return $(".guest").filter(function () {
            const time = $(this).attr("data-time");
            return time >= "20:30" && time <= "21:00";
        });
    } },
    { n: 8, question: "Who arrived after 21:00 and is not an AITU student?", find: function () {
        return $(".guest:not(.aitu)").filter(function () {
            return $(this).attr("data-time") > "21:00";
        });
    } },
    { n: 9, question: "Who stands right next to Askar?", find: function () {
        return $(".guest[data-name='Askar']").prev().add(".guest[data-name='Askar'] + .guest");
    } },
    { n: 10, question: "Who stands last in each room?", find: function () {
        return $(".guest:last-child");
    } },
    { n: 11, question: "Who stands third in each room?", find: function () {
        return $(".guest:nth-child(3)");
    } },
    { n: 12, question: "Who stands after Timur in his room?", find: function () {
        return $(".guest[data-name='Timur']").nextAll();
    } },
    { n: 13, question: "Who stands right before someone in black?", find: function () {
        return $(".guest[data-color='black']").prev();
    } },
    { n: 14, question: "In which room is Aruzhan?", find: function () {
        return $(".guest[data-name='Aruzhan']").closest(".room");
    } },
    { n: 15, question: "Which rooms have fewer than 6 guests?", find: function () {
        return $(".room").filter(function () {
            return $(this).find(".guest").length < 6;
        });
    } },
    { n: 16, question: "Where does somebody have a cup, but nobody wears glasses?", find: function () {
        return $(".room:has(.guest.cup):not(:has(.guest.glasses))");
    } },
    { n: 17, question: "Who came first to each room?", find: function () {
        return $(".guest").filter(function () {
            const time = $(this).attr("data-time");
            return $(this).siblings().filter(function () {
                return $(this).attr("data-time") < time;
            }).length === 0;
        });
    } },
    { n: 18, question: "Miras comes and stands between Askar and Inkar.", changes: true, find: function () {
        return makeGuest(miras).hide().insertAfter(".guest[data-name='Askar']").fadeIn(1000);
    } },
    { n: 19, question: "Natasha says goodbye and goes home.", changes: true, leaves: true, find: function () {
        return $(".guest[data-name='Natasha']").fadeOut(1000, function () {
            $(this).remove();
        });
    } },
    { n: 20, question: "Who took the cake?", find: function () {
        return $(".floor[data-floor='1'] .guest.crumbs:not(.cup)")
            .filter(function () {
                const time = $(this).attr("data-time");
                return time > "21:00" && time < "21:30";
            })
            .filter(function () {
                return $(this).prev().is(".aitu") || $(this).next().is(".aitu");
            });
    } }
];

const thingWords = { phone: "a phone", glasses: "glasses", bag: "a bag", cup: "a cup", crumbs: "cake crumbs" };

const FADE_TIME = 300;
const CARD_TIME = 350;
const MOVE_TIME = 800;
const SORT_TIME = 600;

let sorted = {};           // room id -> true when the room is sorted by time
let partyChanged = false;  // true after case 18 or 19 changed the page
let moving = false;        // true while a guest flies to another room
let $openCard = null;
let openName = "";

// One card for one guest. The data is stored as classes and data-* attributes.
function makeGuest(guest) {
    const $card = $("<div>")
        .addClass("guest")
        .addClass(guest.things.join(" "))
        .attr("data-name", guest.name)
        .attr("data-color", guest.color)
        .attr("data-time", guest.time);
    if (guest.aitu) {
        $card.addClass("aitu");
    }

    const $photo = $("<div>").addClass("guest__photo");
    $("<img>")
        .addClass("guest__avatar")
        .attr("src", "https://api.dicebear.com/9.x/open-peeps/svg?seed=" + guest.name)
        .attr("alt", "")
        .appendTo($photo);
    if (guest.aitu) {
        $("<span>").addClass("guest__badge").attr("title", "AITU student").text("🎓").appendTo($photo);
    }

    const $things = $("<p>").addClass("guest__things");
    for (const thing of guest.things) {
        $("<span>").attr("title", thing).text(icons[thing]).appendTo($things);
    }

    const $body = $("<div>").addClass("guest__body").append(
        $photo,
        $("<p>").addClass("guest__name").text(guest.name),
        $("<p>").addClass("guest__time").text("🕒 " + guest.time),
        $things
    );
    return $card.append($body);
}

// The guests of a room in the order they stand now.
function orderOf(room) {
    if (!sorted[room.id]) {
        return room.guests;
    }
    return room.guests.slice().sort(function (a, b) {
        return a.time.localeCompare(b.time);
    });
}

function makeRoom(room) {
    const $guests = $("<div>").addClass("guests");
    for (const guest of orderOf(room)) {
        $guests.append(makeGuest(guest));
    }
    const $sort = $("<button>")
        .addClass("sort-btn")
        .attr("type", "button")
        .attr("data-room", room.id)
        .attr("aria-pressed", sorted[room.id] ? "true" : "false")
        .text(sorted[room.id] ? "Picture order" : "Sort by time");
    const $head = $("<div>").addClass("room__head").append($("<h3>").addClass("room__name").text(room.name), $sort);
    return $("<section>")
        .addClass("room")
        .attr("id", room.id)
        .attr("data-room", room.name)
        .append($head, $guests);
}

// Builds the whole house again from the array.
function buildParty() {
    const $house = $("#house").empty();
    for (const floor of [2, 1]) {
        const $rooms = $("<div>").addClass("floor__rooms");
        for (const room of rooms) {
            if (room.floor === floor) {
                $rooms.append(makeRoom(room));
            }
        }
        $("<div>")
            .addClass("floor")
            .attr("data-floor", floor)
            .append($("<p>").addClass("floor__label").text("Floor " + floor), $rooms)
            .appendTo($house);
    }
}

// The text of the chain, so the page can show it.
function chainText(oneCase) {
    const code = String(oneCase.find);
    const chain = code.slice(code.indexOf("return ") + 7, code.lastIndexOf(";"));
    return chain.replace(/\n {8}/g, "\n");
}

function showResult(oneCase, $found) {
    const names = $found.map(function () {
        return $(this).attr("data-name") || $(this).attr("data-room");
    }).get();

    let word = $found.is(".room") ? "room" : "guest";
    if (names.length !== 1) {
        word = word + "s";
    }

    $("#result-title").text("Case " + oneCase.n + ". " + oneCase.question);
    $("#result-chain").text(chainText(oneCase));
    if (names.length === 0) {
        $("#result-found").text("Nobody found.");
    } else {
        $("#result-found").text("Found " + names.length + " " + word + ": " + names.join(", "));
    }
}

/* 1. Spotlight */
function spotlight($bright) {
    $(".guest").not($bright).find(".guest__body").stop(true).fadeTo(FADE_TIME, 0.2);
    $bright.find(".guest__body").stop(true).fadeTo(FADE_TIME, 1);
}

function clearAll() {
    $(".found").removeClass("found");
    $(".guest__body").stop(true).fadeTo(FADE_TIME, 1);
    $(".case-btn").removeClass("case-btn--active");
    $("#result-title").text("Click a case to start.");
    $("#result-chain").text("");
    $("#result-found").text("");
}

function runCase(oneCase) {
    closeCard();
    if (partyChanged) {
        buildParty();
        partyChanged = false;
    }
    $(".found").removeClass("found");

    const $found = oneCase.find();
    if (oneCase.changes) {
        partyChanged = true;
    }

    $found.addClass("found");
    let $guests = $found;
    if ($found.is(".room")) {
        $guests = $found.find(".guest");
    }
    $guests.find(".guest__photo").stop(true).animate({ top: -16 }, 180).animate({ top: 0 }, 180);

    if (oneCase.leaves) {
        $(".guest__body").stop(true).fadeTo(FADE_TIME, 1);
    } else {
        spotlight($guests);
    }

    showResult(oneCase, $found);
    $(".case-btn").removeClass("case-btn--active");
    $(".case-btn[data-case='" + oneCase.n + "']").addClass("case-btn--active");
}

function buildCaseButtons() {
    for (const oneCase of cases) {
        $("<button>")
            .addClass("case-btn")
            .attr("type", "button")
            .attr("data-case", oneCase.n)
            .append($("<span>").addClass("case-btn__num").text(oneCase.n), " " + oneCase.question)
            .appendTo("#cases");
    }
}

/* 2. Guest card */
function findInArray(name) {
    for (const room of rooms) {
        const guest = room.guests.find(function (g) {
            return g.name === name;
        });
        if (guest) {
            return { room: room, guest: guest };
        }
    }
    return null;
}

function listWords(words) {
    if (words.length === 1) {
        return words[0];
    }
    return words.slice(0, -1).join(", ") + " and " + words[words.length - 1];
}

function cardContent($guest) {
    const name = $guest.attr("data-name");
    const $room = $guest.closest(".room");
    const floor = $guest.closest(".floor").attr("data-floor");

    const things = [];
    for (const thing of ["phone", "glasses", "bag", "cup", "crumbs"]) {
        if ($guest.hasClass(thing)) {
            things.push(thingWords[thing]);
        }
    }

    const $facts = $("<ul>").addClass("info__facts").append(
        $("<li>").text("Came at " + $guest.attr("data-time")),
        $("<li>").text($guest.hasClass("aitu") ? "AITU student" : "Not an AITU student"),
        $("<li>").text(things.length ? "Has " + listWords(things) : "Came with nothing"),
        $("<li>").text("Dressed in " + $guest.attr("data-color")),
        $("<li>").text("Stands in the " + $room.attr("data-room").toLowerCase() + " on floor " + floor)
    );

    const $moves = $("<div>").addClass("info__moves");
    for (const room of rooms) {
        if (room.id !== $room.attr("id")) {
            $("<button>")
                .addClass("btn info__move")
                .attr("type", "button")
                .attr("data-room", room.id)
                .text("Move to the " + room.name.toLowerCase())
                .appendTo($moves);
        }
    }

    return $("<div>").addClass("info__inner").append(
        $("<img>").addClass("info__avatar").attr("src", $guest.find(".guest__avatar").attr("src")).attr("alt", ""),
        $("<h3>").addClass("info__name").text(name),
        $facts,
        $moves
    );
}

function openCard($guest) {
    const $photo = $guest.find(".guest__photo");
    const start = $photo.offset();
    const size = $photo.outerWidth();
    const width = Math.min(320, $(window).width() - 32);

    const $card = $("<div>").addClass("info").css("width", width).append(cardContent($guest)).appendTo("body");
    $card.find(".info__inner").css("width", width);
    const height = $card.outerHeight();
    const left = $(window).scrollLeft() + ($(window).width() - width) / 2;
    const top = $(window).scrollTop() + Math.max(16, ($(window).height() - height) / 2);

    $card
        .css({ left: start.left, top: start.top, width: size, height: size, opacity: 0.4 })
        .animate({ left: left, top: top, width: width, height: height, opacity: 1 }, CARD_TIME);

    $openCard = $card;
    openName = $guest.attr("data-name");
}

function closeCard() {
    if (!$openCard) {
        return;
    }
    const $card = $openCard;
    $openCard = null;

    const $photo = $(".guest[data-name='" + openName + "'] .guest__photo");
    openName = "";
    if ($photo.length === 0) {
        $card.stop(true).fadeOut(CARD_TIME, function () {
            $(this).remove();
        });
        return;
    }
    const end = $photo.offset();
    const size = $photo.outerWidth();
    $card.stop(true).animate({ left: end.left, top: end.top, width: size, height: size, opacity: 0 }, CARD_TIME, function () {
        $(this).remove();
    });
}

/* 3. Move */
function moveGuest(name, roomId) {
    const $guest = $(".guest[data-name='" + name + "']");
    const $target = $("#" + roomId + " .guests");
    moving = true;

    const start = $guest.offset();
    const $flyer = $guest.clone()
        .addClass("guest--flying")
        .css({ left: start.left, top: start.top })
        .appendTo("body");

    // a new place opens slowly at the end of the new room
    const $slot = $("<div>").addClass("slot").css("height", $guest.outerHeight()).appendTo($target);
    $slot.animate({ width: $guest.outerWidth() }, MOVE_TIME);
    const end = $slot.offset();

    // the old place closes slowly
    $guest.css("visibility", "hidden").animate({ width: 0, marginLeft: 0, marginRight: 0 }, MOVE_TIME);

    $flyer.animate({ left: end.left, top: end.top }, MOVE_TIME, function () {
        $guest.stop(true).css({ width: "", marginLeft: "", marginRight: "", visibility: "" });
        $slot.stop(true).replaceWith($guest);
        $flyer.remove();

        // the array changes too, so the cases find the guest in the new room
        const place = findInArray(name);
        if (place) {
            place.room.guests.splice(place.room.guests.indexOf(place.guest), 1);
            rooms.find(function (room) {
                return room.id === roomId;
            }).guests.push(place.guest);
        }
        moving = false;
        if (sorted[roomId]) {
            arrangeRoom(roomId);
        }
    });
}

/* 4. Sort by time */
function arrangeRoom(roomId) {
    const room = rooms.find(function (r) {
        return r.id === roomId;
    });
    const $list = $("#" + roomId + " .guests");
    const $cards = $list.children(".guest");

    // where every card is on the screen now, even in the middle of a move
    const before = {};
    $cards.stop(true).each(function () {
        before[$(this).attr("data-name")] = $(this).position();
    });

    // put the cards in the new order and read their new places
    for (const guest of orderOf(room)) {
        $list.append($list.children(".guest[data-name='" + guest.name + "']"));
    }
    $cards.css({ left: 0, top: 0 });

    // start every card at its old place and slide it to the new one
    $cards.each(function () {
        const now = $(this).position();
        const old = before[$(this).attr("data-name")];
        $(this)
            .css({ left: old.left - now.left, top: old.top - now.top })
            .animate({ left: 0, top: 0 }, SORT_TIME);
    });

    $("#" + roomId + " .sort-btn")
        .attr("aria-pressed", sorted[roomId] ? "true" : "false")
        .text(sorted[roomId] ? "Picture order" : "Sort by time");
}

$(function () {
    buildParty();
    buildCaseButtons();

    $("#cases").on("click", ".case-btn", function () {
        if (moving) {
            return;
        }
        const n = Number($(this).attr("data-case"));
        const oneCase = cases.find(function (c) {
            return c.n === n;
        });
        runCase(oneCase);
    });

    $("#clear").on("click", function () {
        if (moving) {
            return;
        }
        clearAll();
    });

    $("#house").on("click", ".guest", function () {
        if (moving) {
            return;
        }
        const name = $(this).attr("data-name");
        const sameGuest = $openCard && openName === name;
        closeCard();
        if (!sameGuest) {
            openCard($(this));
        }
    });

    $("#house").on("click", ".sort-btn", function () {
        if (moving) {
            return;
        }
        const roomId = $(this).attr("data-room");
        sorted[roomId] = !sorted[roomId];
        arrangeRoom(roomId);
    });

    $(document).on("click", ".info__move", function () {
        if (moving) {
            return;
        }
        const name = openName;
        const roomId = $(this).attr("data-room");
        closeCard();
        moveGuest(name, roomId);
    });

    // a click outside the card closes it
    $(document).on("click", function (event) {
        if ($(event.target).closest(".info, .guest").length === 0) {
            closeCard();
        }
    });

    $(document).on("keydown", function (event) {
        if (event.key === "Escape") {
            closeCard();
        }
    });
});
