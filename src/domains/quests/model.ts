import { createEvent, createStore, sample } from "effector";

export type Quest = {
  id: string;
  title: string;
  done: boolean;
};

export const questToggled = createEvent<string>();

export const $quests = createStore<Quest[]>([]);

sample({
  clock: questToggled,
  source: $quests,
  fn: (quests, id) =>
    quests.map((quest) =>
      quest.id === id ? { ...quest, done: !quest.done } : quest,
    ),
  target: $quests,
});
