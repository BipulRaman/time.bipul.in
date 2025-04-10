var tzMap = {
    "NZST": { zone: "Pacific/Auckland", utcGap: "+12:00" },
    "AEST": { zone: "Australia/Sydney", utcGap: "+10:00" },
    "JST": { zone: "Asia/Tokyo", utcGap: "+09:00" },
    "IST": { zone: "Asia/Kolkata", utcGap: "+05:30" },
    "EET": { zone: "Europe/Helsinki", utcGap: "+02:00" },
    "CET": { zone: "Europe/Berlin", utcGap: "+01:00" },
    "GMT": { zone: "Europe/London", utcGap: "+00:00" },
    "UTC": { zone: "UTC", utcGap: "+00:00" },
    "AST": { zone: "Asia/Riyadh", utcGap: "+03:00" },
    "ADT": { zone: "America/Halifax", utcGap: "-03:00" },
    "EST": { zone: "America/New_York", utcGap: "-05:00" },
    "CST": { zone: "America/Chicago", utcGap: "-06:00" },
    "MST": { zone: "America/Denver", utcGap: "-07:00" },
    "PST": { zone: "America/Los_Angeles", utcGap: "-08:00" },
    "AKDT": { zone: "America/Anchorage", utcGap: "-08:00" },
};

function updateClock(clockId, tzSelectId) {
    const timezone = tzMap[document.getElementById(tzSelectId).value].zone;
    const now = new Date().toLocaleTimeString('en-US', { timeZone: timezone });
    document.getElementById(clockId).textContent = now;
}

function updateDate(dateId, tzSelectId) {
    const timezone = tzMap[document.getElementById(tzSelectId).value].zone;
    const now = new Date().toLocaleDateString('en-US', { timeZone: timezone, year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
    document.getElementById(dateId).textContent = now;
}

function updateClockDifference() {
    const t1 = document.getElementById('timezone1').value;
    const t2 = document.getElementById('timezone2').value;

    // Get the current time in UTC and the selected timezones
    const nowUTC = new Date(new Date().toISOString()); // Correctly set to UTC
    const nowTZ1 = new Date(new Date().toLocaleString('en-US', { timeZone: tzMap[t1].zone }));
    const nowTZ2 = new Date(new Date().toLocaleString('en-US', { timeZone: tzMap[t2].zone }));

    // Calculate the difference in hours with reference to UTC
    const diffClock1UTC = (nowTZ1.getTime() - nowUTC.getTime()) / (1000 * 60 * 60); // Clock 1 - UTC
    const diffClock2UTC = (nowTZ2.getTime() - nowUTC.getTime()) / (1000 * 60 * 60); // Clock 2 - UTC

    // Calculate the difference between the two clocks
    const clockDifference = diffClock1UTC - diffClock2UTC;

    // Check for daylight saving time adjustment
    const isDST1 = new Date().toLocaleString('en-US', { timeZone: tzMap[t1].zone, timeZoneName: 'short' }).includes('DT');
    const isDST2 = new Date().toLocaleString('en-US', { timeZone: tzMap[t2].zone, timeZoneName: 'short' }).includes('DT');

    const dstFactor = isDST1 || isDST2 ? " (* Daylight Saving)" : "";

    document.getElementById('clock2-difference').textContent = `Difference: ${clockDifference.toFixed(1)} hours${dstFactor}`;
}

function attachTimezoneChangeListeners() {
    document.getElementById('timezone1').addEventListener('change', () => {
        updateClock('clock1', 'timezone1');
        updateDate('date1', 'timezone1');
        updateClockDifference();
    });

    document.getElementById('timezone2').addEventListener('change', () => {
        updateClock('clock2', 'timezone2');
        updateDate('date2', 'timezone2');
        updateClockDifference();
    });
}

function startClocks() {
    setInterval(() => updateClock('clock1', 'timezone1'), 1000);
    setInterval(() => {
        updateClock('clock2', 'timezone2');
        updateClockDifference();
    }, 1000);
}

function startDateUpdates() {
    setInterval(() => updateDate('date1', 'timezone1'), 1000);
    setInterval(() => updateDate('date2', 'timezone2'), 1000);
}

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        t1: params.get('t1') || '',
        t2: params.get('t2') || ''
    };
}

function updateURLParams(t1, t2) {
    const params = new URLSearchParams(window.location.search);
    params.set('t1', t1);
    params.set('t2', t2);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

// Normalize timezone names to handle browser differences
function normalizeTimezone(timezone) {
    if (timezone === "Asia/Calcutta") {
        return "Asia/Kolkata";
    }
    return timezone;
}

// Function to update the date display
function updateDateDisplay() {
    const dateElement = document.getElementById('date-display');
    const now = new Date();

    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
    const formattedDate = now.toLocaleDateString('en-US', options);

    dateElement.textContent = formattedDate;
}

document.addEventListener('DOMContentLoaded', () => {
    // Populate dropdowns dynamically using tzMap
    const populateDropdown = (dropdownId) => {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = ''; // Clear existing options

        for (const [key, value] of Object.entries(tzMap)) {
            const option = document.createElement('option');
            option.value = key; // Use the key as the value
            option.textContent = `${key} ${value.utcGap} ${value.zone}`;
            dropdown.appendChild(option);
        }
    };

    populateDropdown('timezone1');
    populateDropdown('timezone2');

    // Detect user's timezone and set it as default if params are not defined
    const { t1, t2 } = getURLParams();
    if (!t1 && !t2) {
        const userTimezone = normalizeTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        const userTzKey = Object.keys(tzMap).find(key => tzMap[key].zone === userTimezone);

        if (userTzKey) {
            document.getElementById('timezone1').value = userTzKey;
            document.getElementById('timezone2').value = userTzKey;
        } else {
            console.warn(`User's timezone (${userTimezone}) not found in tzMap.`);
        }
    } else {
        if (t1) document.getElementById('timezone1').value = t1;
        if (t2) document.getElementById('timezone2').value = t2;
    }

    attachTimezoneChangeListeners();
    startClocks();
    startDateUpdates();

    // Update URL params when dropdown values change
    document.getElementById('timezone1').addEventListener('change', () => {
        updateURLParams(document.getElementById('timezone1').value, document.getElementById('timezone2').value);
    });

    document.getElementById('timezone2').addEventListener('change', () => {
        updateURLParams(document.getElementById('timezone1').value, document.getElementById('timezone2').value);
    });

    updateDateDisplay();
});