const { puffin } = require("../src/main.js");

/**
 * @desc This is a very basic TODO app
 */


const list = [];

const Todo = puffin.element(
  `
      <div class="todo">
        <h3 class="task_title">Default Title</h3>
        <p class="task_description">Default description</p>
      </div>
    `,
  {
    props: [
      {
        class: "task_title",
        type: "text",
        value: "$title"
      },
      {
        class: "task_description",
        type: "text",
        value: "$description"
      }
    ]
  }
);
function App() {
  const Todolist = puffin.element(
    `
       <div>
        <h2>Todo Demo </h2>
        <input class="input_title" placeHolder="A title" >Title</input>
        <input class="input_description" placeHolder="A description"> Description</input>
        <button onClick="$addTodo">Add</button>
          ${(function() {
            let content = "";
            list.map(task => {
              content += `<Todo title="${task.title}" description="${task.description}"></Todo>`;
            });
            return content;
          })()}
       </div>
    `,
    {
      components: {
        Todo
      },
      methods: [
        function addTodo() {
          list.push({
            title: this.parentElement.getElementsByClassName("input_title")[0]
              .value,
            description: this.parentElement.getElementsByClassName(
              "input_description"
            )[0].value
          });
          App();
        }
      ]
    }
  );
  puffin.render(Todolist, document.getElementById("app"));
}

App();
