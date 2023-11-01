function getRelativeTimeString(date) {
  // Allow dates or times to be passed
  const timeMs = date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];

  // Array equivalent to the above but in the string representation of the units
  const units = ["second", "minute", "hour", "day", "week", "month", "year"];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  );

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat("cs", { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

async function displayGithubRepos() {
  try {
    const res = await fetch("https://api.github.com/users/AdamPrchal/repos");
    if (res.ok) {
      const repos = await res.json();
      repos.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
      const projectListElement = document.getElementById("projekty");

      for (const repo of repos) {
        const newElement = document.createElement("article");
        newElement.setAttribute("class", "repo");

        const title = document.createElement("h3");
        title.innerHTML = repo.name;

        const lastUpdated = document.createElement("p");
        const formattedDate = getRelativeTimeString(
          new Date(Date.parse(repo.updated_at))
        );
        lastUpdated.innerHTML = `Změněno ${formattedDate}`;

        newElement.appendChild(title);
        newElement.appendChild(lastUpdated);

        projectListElement.appendChild(newElement);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function main() {
  displayGithubRepos();
}

main();
