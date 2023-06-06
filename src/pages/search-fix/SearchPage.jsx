import { useState } from "react";
import * as Style from "./styles/SearchPageStyle";

const SearchPage = () => {
  const searchData = useQueries({
    queries: [
      {
        queryKey: ["users"],
        queryFn: () =>
          fetch("http://localhost:9999/user").then((response) =>
            response.json()
          ),
      },
      {
        queryKey: ["hospitals"],
        queryFn: () =>
          fetch("http://localhost:9999/hospital").then((response) =>
            response.json()
          ),
      },
      {
        queryKey: ["favorites"],
        queryFn: () =>
          fetch("http://localhost:9999/favorite").then((response) =>
            response.json()
          ),
      },
    ],
  });
  return <></>;
};
