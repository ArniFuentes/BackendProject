const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  const fetchParams = {
    url: "api/users",
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(obj),
  };

  try {
    const response = await fetch(fetchParams.url, {
      headers: fetchParams.headers,
      method: fetchParams.method,
      body: fetchParams.body,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    window.location.href = "index.html";

  } catch (error) {
    console.log(error);
  }
});
