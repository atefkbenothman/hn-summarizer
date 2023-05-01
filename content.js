function addCommentButton(comment) {
  // get comment text
  var commentText = comment.getElementsByClassName("commtext")[0].innerText;

  // get the 'reply' text/link element from the comment
  var navbar = comment.getElementsByClassName("reply")[0];

  if (!navbar) {
    console.log("could not find any replies")
  }

  // create 'eli5' button by duplicating 'reply' button
  const button = document.createElement("p");
  var link = document.createElement("a");

  link.innerText = "summarize"
  link.style.fontSize = "10";
  link.style.textDecoration = "underline";
  link.style.cursor = "pointer";

  button.appendChild(link);
  navbar.appendChild(button);

  // on click
  button.addEventListener("click", async () => {
    // call api
    const apiURL = "https://api.openai.com/v1/chat/completions";
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer <REPLACE_WITH_API_KEY>"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "user",
            "content": "Explain and simplify the following text to me as if I was 10 years old. Use analogies if suitable. Be clear and concise.: " + commentText
          }
        ],
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        stream: false,
        n: 1,
      })
    });

    const data = await response.json();

    if (!data.choice) {
      console.log("err response from api: " + data)
    }

    var dataText = data.choices[0].message.content;

    // create new p tag element for the response
    var resp = document.createElement("p");
    resp.innerText = dataText;

    navbar.appendChild(resp);
  });
}

// get all 'comment' elements in the dom, add gpt button
var comments = document.getElementsByClassName("comment");
for (var i = 0; i < comments.length; i++) {
  addCommentButton(comments[i]);
}
