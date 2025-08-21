import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

import ToDoApp from "./ToDoApp.svelte";

test("ToDoApp", async () => {
  const user = userEvent.setup();
  render(ToDoApp);

  let toDoListItems = screen.getAllByText(/.*/, { selector: "ul > li" });
  expect(toDoListItems.length).toBe(3);

  const addToDoButton = screen.getByText("Add to do");

  await user.click(addToDoButton);

  toDoListItems = screen.getAllByText(/.*/, { selector: "ul > li" });
  expect(toDoListItems.length).toBe(4);
});
