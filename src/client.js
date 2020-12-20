import { createClient } from "graphql-ws";

const client = createClient({
  url: "wss://localhost:4000/graphql",
});

// query
(async () => {
  const result = await new Promise((resolve, reject) => {
    let result;
    client.subscribe(
      {
        query: "{ hello }",
      },
      {
        next: (data) => (result = data),
        error: reject,
        complete: () => resolve(result),
      }
    );
  });

  expect(result).toEqual({ hello: "Hello World!" });
})();

// subscription
(async () => {
  const onNext = () => {
    /**/
  };

  await new Promise((resolve, reject) => {
    client.subscribe(
      {
        query: "subscription { greetings }",
      },
      {
        next: onNext,
        error: reject,
        complete: resolve,
      }
    );
  });

  expect(onNext).toBeCalledTimes(5); // we say "Hi" in 5 languages
})();
