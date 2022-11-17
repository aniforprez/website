function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

function buildSearchResultItem(item) {
  return `
  <li class="mb-8">
    <a href="${item.ref}" class="dark:hover:text-slate-300 hover:text-gray-500">
      <span class="text-xl font-bold lg:text-2xl">${item.doc.title}</span>
    </a>
    <div class="mt-2 text-base text-gray-700 lg:text-lg dark:text-slate-300">${item.doc.description}</div>
    <div class="mt-2">
      <span class="text-gray-600 dark:text-slate-400">
        <i class='bx bxs-calendar'></i>
        {{ page.date | date(format="%d, %b %Y") }}
      </span>
      {% for tag in page.taxonomies.tags %}
      <a href="/tags/{{ tag }}"
        class="text-black dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-600">
        <span class="px-2">#{{tag}}</span>
      </a>
      {% endfor %}
    </div>
  </li>
  `;
}

function initSearch() {
  var $searchInput = document.getElementById("search");
  var $searchResults = document.getElementById("search-results");
  var $blogPages = document.getElementById("blog-pages");
  var MAX_ITEMS = 10;

  var options = {
    bool: "AND",
    fields: {
      title: { boost: 2 },
      body: { boost: 1 },
    },
  };
  var currentTerm = "";
  var index = elasticlunr.Index.load(window.searchIndex);

  $searchInput.addEventListener(
    "keyup",
    debounce(function () {
      var term = $searchInput.value.trim();
      if (term === currentTerm || !index) {
        return;
      }
      $searchResults.style.display = term === "" ? "none" : "block";
      currentTerm = term;
      if (term === "") {
        $blogPages.classList.remove("hidden");
        $searchResults.classList.add("hidden");
        return;
      }

      var results = index.search(term, options);

      $searchResults.classList.remove("hidden");
      $blogPages.classList.add("hidden");
      for (var i = 0; i < Math.min(results.length, MAX_ITEMS); i++) {
        var item = document.createElement("li");
        $blogPages.classList.add("hidden");
        item.innerHTML = buildSearchResultItem(results[i], term.split(" "));
        $searchResults.appendChild(item);
      }
    }, 150)
  );

  window.addEventListener("click", function (e) {
    if (
      $searchResults.style.display == "block" &&
      !$searchResults.contains(e.target)
    ) {
      $searchResults.style.display = "none";
    }
  });
}

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  initSearch();
} else {
  document.addEventListener("DOMContentLoaded", initSearch);
}
